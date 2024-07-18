const {SlashCommandBuilder, Events, EmbedBuilder, PermissionFlagsBits} = require('discord.js')
const {eq} = require('drizzle-orm')
const {db} = require('../../lib/db/db')
const {serverSettings} = require('../../lib/db/schema')

module.exports = {
    name: Events.InteractionCreate,
    data: new SlashCommandBuilder().setName('settings').setDescription('Edit Luna guild settings.').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(ctx) {
        let initialServerSettings = await db.select().from(serverSettings).where(eq(serverSettings.guild_id, ctx.guild.id))
        if (initialServerSettings.length == 0) {
            await db.insert(serverSettings).values({
                'aiFeatures': false,
                'guild_id': ctx.guild.id
            })
        }
        const editEmbed = new EmbedBuilder().setColor('Aqua').setTitle("Guild settings:")
        .addFields({'name': "Enable AI Features", value: "❌"})
    },
}