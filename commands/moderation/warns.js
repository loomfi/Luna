const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { eq } = require('drizzle-orm');
const { db } = require('../../lib/db/db');
const { serverSettings, warnStorage } = require('../../lib/db/schema');

module.exports = {
    data: new SlashCommandBuilder().setName('warns').setDescription('Review warns for a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => option.setName('user').setDescription("User to review warns").setRequired(true))
        .setDMPermission(false),
    
    async execute(ctx) {
        let serverPermissions = await db.select().from(serverSettings).where(eq(serverSettings.guild_id, ctx.guild.id));
        if (serverPermissions[0].moderationFeatures == true) {
            await ctx.deferReply();
            let target = ctx.options.getUser('user').id
            let warnList = await db.select().from(warnStorage).where(eq(warnStorage.guild_id, ctx.guild.id)).where(eq(warnStorage.user_id, target)).limit(5)
            let compile_embed = new EmbedBuilder().setTitle(`${warnList.length} Warning(s) for @${ctx.options.getUser('user').username} (limited to top 5)`).addFields((warnList.map(warns => {
                return {
                    'name': `Infraction`,
                    'value': `Issuer: <@${warns.issuer_id}>, Reason: ${warns.reason}`
                }
            })))
            await ctx.editReply({embeds: [compile_embed]})
        } else {
            await ctx.reply("This feature isn't enabled, please ask your admin to enable.")
        }
    },
};
