CREATE TABLE `middleman_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`protocol` varchar(32) NOT NULL,
	`discordId` varchar(64) NOT NULL,
	`discordTag` varchar(120) NOT NULL,
	`ageRange` varchar(40) NOT NULL,
	`timezone` varchar(80) NOT NULL,
	`experience` text NOT NULL,
	`availability` text NOT NULL,
	`motivation` text NOT NULL,
	`trust` text NOT NULL,
	`scenario` text NOT NULL,
	`references` text,
	`extra` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `middleman_applications_id` PRIMARY KEY(`id`),
	CONSTRAINT `middleman_applications_protocol_unique` UNIQUE(`protocol`)
);
--> statement-breakpoint
CREATE TABLE `middleman_roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`description` text NOT NULL,
	`color` varchar(32) NOT NULL DEFAULT 'green',
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `middleman_roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `middlemen` (
	`id` int AUTO_INCREMENT NOT NULL,
	`displayName` varchar(160) NOT NULL,
	`discordId` varchar(64) NOT NULL,
	`roleName` varchar(120) NOT NULL,
	`focus` varchar(160),
	`availability` varchar(160),
	`status` enum('active','paused') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `middlemen_id` PRIMARY KEY(`id`)
);
