/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'plus-plus',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			home: 'cloudflare',
		};
	},
	async run() {
		const clientId = new sst.Secret('SlackClientId');
		const clientSecret = new sst.Secret('SlackClientSecret');
		const signingSecret = new sst.Secret('SlackSigningSecret');

		const installationsKv = new sst.cloudflare.Kv('PlusPlusInstallations');
		const oauthStates = new sst.cloudflare.Kv('PlusPlusOAuthStates');
		const db = new sst.cloudflare.D1('PlusPlus');

		const worker = new sst.cloudflare.Worker('PlusPlusBot', {
			handler: './src/index.ts',
			link: [installationsKv, oauthStates, db],
			url: true,
			environment: {
				SLACK_SIGNING_SECRET: signingSecret.value,
				SLACK_CLIENT_ID: clientId.value,
				SLACK_CLIENT_SECRET: clientSecret.value,
				SLACK_BOT_SCOPES: 'chat:write,chat:write.public,app_mentions:read,users:read',
			},
		});

		return {
			url: worker.url,
		};
	},
});
