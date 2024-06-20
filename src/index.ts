import { SlackOAuthApp, KVInstallationStore, KVStateStore, SlackOAuthAndOIDCEnv } from 'slack-cloudflare-workers';
import { Resource } from 'sst';

type Env = SlackOAuthAndOIDCEnv & {};

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const app = new SlackOAuthApp({
			env,
			installationStore: new KVInstallationStore(env, Resource.PlusPlusInstallations),
			stateStore: new KVStateStore(Resource.PlusPlusOAuthStates),
		}).event('app_mention', async ({ context }) => {
			await context.client.chat.postMessage({
				channel: context.channelId,
				text: `:wave: <@${context.userId}> what's up?`,
			});
		});
		return await app.run(request, ctx);
	},
} satisfies ExportedHandler<Env>;
