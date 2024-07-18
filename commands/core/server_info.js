const {eq} = require('drizzle-orm')
const {db} = require('../../lib/db/db')
const {announcementChannel} = require('../../lib/db/schema')

const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('server').setDescription('Grab server information.').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(ctx) {
        let announcementsTracking = await db.select().from(announcementChannel)
        let serverInfoEmbed = new EmbedBuilder().setColor('#c93622')
        .setTitle(`Server information for ${ctx.guild.name}`)
        .addFields(
            {'name': "Owner", value: `${await ctx.guild.fetchOwner()}`},
            {'name': "Server population", value: `${ctx.guild.memberCount} members.`},
            {'name': "Server ID", value: `${ctx.guild.id}`},
            {'name': "Bot-Server metrics", value: `Announcements tracking: ${(announcementsTracking.length != 0) ? '🟢' : '🔴'}`}
        )
        await ctx.reply({ embeds: [serverInfoEmbed]})
    },
}