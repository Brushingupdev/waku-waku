CREATE TABLE `product_edits` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`series` text DEFAULT '' NOT NULL,
	`price` integer,
	`status` text DEFAULT 'por_confirmar' NOT NULL,
	`quantity` integer,
	`month` text DEFAULT '' NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`source` text DEFAULT '' NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`updated_at` text NOT NULL
);
