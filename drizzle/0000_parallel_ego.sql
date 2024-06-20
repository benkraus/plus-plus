CREATE TABLE `karma` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`team_id` text NOT NULL,
	`sender` text NOT NULL,
	`receiver` text NOT NULL,
	`amount` integer DEFAULT 1 NOT NULL
);
