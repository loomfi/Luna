const {serial, text, pgTable, pgSchema, boolean} = require('drizzle-orm/pg-core')

export const lunaSchema = pgSchema('dbSchema')

export const warnStorage = lunaSchema.table('guild_warns', {
    id: serial('id').primaryKey(),
    guild_id: text('guild_id').notNull(),
    user_id: text('user_id').notNull(),
    reason: text('reason'),
    issuer_id: text('warn_issuer_id'),
})

export const serverSettings = lunaSchema.table('guild_settings', {
    id: serial('id').primaryKey(),
    guild_id: text('guild_id').unique().notNull(),
    aiFeatures: boolean('ai_enabled'),
    moderationFeatures: boolean('moderation_enabled'),
})