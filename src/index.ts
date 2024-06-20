import { SlackOAuthApp, KVInstallationStore, KVStateStore, SlackOAuthAndOIDCEnv } from 'slack-cloudflare-workers';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, sql } from 'drizzle-orm';
import { Resource } from 'sst';
import { karma } from './schema';
import { KarmaMessageType, getRandomMessage } from './messages';

type Env = SlackOAuthAndOIDCEnv & {};

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const db = drizzle(Resource.PlusPlus);

		const app = new SlackOAuthApp({
			env,
			installationStore: new KVInstallationStore(env, Resource.PlusPlusInstallations),
			stateStore: new KVStateStore(Resource.PlusPlusOAuthStates),
		})
			.event('app_mention', async ({ context }) => {})
			.message(/<?@([^>]+)>?\s*(\+\+|--)/g, async ({ context, payload }) => {
				const teamId = context.teamId;
				const sender = context.userId;
				const regex = /<?@([^>]+)>?\s*(\+\+|--)/g;
				const matches: Array<{ target: string; action: '++' | '--' }> = [];
				let match;
				let matchesByUser: Record<string, number> = {};

				while ((match = regex.exec(payload.text)) !== null) {
					matches.push({
						target: match[1],
						action: match[2] === '++' ? '++' : '--',
					});
				}

				// Forbid self promotion, but allow self degradation 😅
				if (matches.some((match) => match.target === sender && match.action === '++')) {
					await context.client.chat.postMessage({
						channel: context.channelId,
						text: getRandomMessage(KarmaMessageType.SelfPlus),
					});
					return;
				}

				for (const operation of matches) {
					const amount = operation.action === '++' ? 1 : -1;
					await db.insert(karma).values({
						teamId,
						sender,
						receiver: operation.target,
						amount,
					});
					matchesByUser[operation.target] = (matchesByUser[operation.target] || 0) + amount;
				}
				// Aggregate the karma for each receiver so we only post the final score once for each user
				for (const [receiver, count] of Object.entries(matchesByUser)) {
					const receiverKarma = await db
						.select({
							count: sql<number>`sum(${karma.amount})`.as('count'),
						})
						.from(karma)
						.where(and(eq(karma.teamId, teamId), eq(karma.receiver, receiver)));

					await context.client.chat.postMessage({
						channel: context.channelId,
						text: `${getRandomMessage(count > 0 ? KarmaMessageType.PlusPlus : KarmaMessageType.MinusMinus)} [<@${receiver}> is now at ${
							receiverKarma[0].count
						}]`,
					});
				}
			})
			.command('/++leaderboard', async ({ context }) => {
				const leaderboard = await db
					.select({
						receiver: karma.receiver,
						score: sql<number>`sum(${karma.amount})`.as('score'),
					})
					.from(karma)
					.where(eq(karma.teamId, context.teamId))
					.groupBy(karma.receiver)
					.orderBy(sql`score desc`)
					.limit(50);

				const message = leaderboard.map((user) => `<@${user.receiver}>: ${user.score}`).join('\n');
				await context.respond({
					text: message,
				});
			})
			.command('/++me', async ({ context }) => {
				const score = await db
					.select({
						count: sql<number>`sum(${karma.amount})`.as('count'),
					})
					.from(karma)
					.where(and(eq(karma.teamId, context.teamId), eq(karma.receiver, context.userId)));

				await context.respond({
					text: `Your current score is ${score[0].count}`,
				});
			});
		return await app.run(request, ctx);
	},
} satisfies ExportedHandler<Env>;
