import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({
	path: '.env',
});

export default defineConfig({
	dialect: 'sqlite',
	driver: 'd1-http',
	schema: './src/schema.ts',
	out: './drizzle',
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
		databaseId: process.env.D1_DATABASE_ID,
		token: process.env.CLOUDFLARE_API_TOKEN,
	},
});
