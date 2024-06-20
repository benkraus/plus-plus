import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const karma = sqliteTable('karma', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	timestamp: text('timestamp')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	teamId: text('team_id').notNull(),
	sender: text('sender').notNull(),
	receiver: text('receiver').notNull(),
	amount: integer('amount').notNull().default(1),
});
