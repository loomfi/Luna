const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { eq } = require('drizzle-orm');
const { db } = require('../../lib/db/db');
const { serverSettings, warnStorage } = require('../../lib/db/schema');

module.exports = {
    data: new SlashCommandBuilder().setName('warn').setDescription('Warn a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => option.setName('user').setDescription("User to warn").setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription("Reason for warn").setRequired(false))
        .setDMPermission(false),
    
    async execute(ctx) {
        let serverPermissions = await db.select().from(serverSettings).where(eq(serverSettings.guild_id, ctx.guild.id));

        if (serverPermissions[0].moderationFeatures == true) {
            ctx.options.getUser('user').id

        } else {
            await ctx.reply("This feature isn't enabled, please ask your admin to enable.")
        }
    },
};
