const {serial, text, pgTable, pgSchema, boolean} = require('drizzle-orm/pg-core')

export const lunaSchema = pgSchema('dbSchema')

export const serverSettings = lunaSchema.table('guild_settings', {
    id: serial('id').primaryKey(),
    guild_id: text('guild_id').unique().notNull(),
    aiFeatures: boolean('ai_enabled'),
    moderationFeatures: boolean('moderation_enabled'),
})