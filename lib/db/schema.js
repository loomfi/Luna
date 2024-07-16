const {serial, text, pgTable, pgSchema} = require('drizzle-orm/pg-core')

export const lunaSchema = pgSchema('lunaSchema')

export const announcementChannel = lunaSchema.table('announcement_channel', {
    id: serial('id').primaryKey(),
    channel_id: text('channel_id').notNull(),
    guild_id: text('guild_id').unique().notNull(),
})