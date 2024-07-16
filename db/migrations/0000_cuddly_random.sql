CREATE SCHEMA "lunaSchema";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lunaSchema"."announcement_channel" (
	"id" serial PRIMARY KEY NOT NULL,
	"channel_id" text NOT NULL,
	"guild_id" text NOT NULL,
	CONSTRAINT "announcement_channel_guild_id_unique" UNIQUE("guild_id")
);
