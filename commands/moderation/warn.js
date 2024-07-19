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
        let reason = ctx.options.getString('reason') || 'No reason has been given';
        if (serverPermissions[0].moderationFeatures == true) {
            let target = ctx.options.getUser('user').id
            await db.insert(warnStorage).values({
                'guild_id': ctx.guild.id,
                'user_id': target,
                'reason': reason,
                'issuer_id': ctx.user.id.toString()
            })
            try {
                let warnEmbed = new EmbedBuilder().setTitle("You have been warned!").setColor('Red').setDescription(`You have been warned in ${ctx.guild.name}.`).addFields({
                    'name': "Reason",
                    'value': reason
                }).setTimestamp()
                await ctx.options.getUser('user').send({embeds: [warnEmbed]})
            } catch {}
            let warnHead = new EmbedBuilder().setTitle("Confirmation").setColor('Blue').setDescription(`I have confirmed that you have warned ${ctx.options.getUser('user')}.`).setTimestamp()
            await ctx.reply({embeds: [warnHead]})
        } else {
            await ctx.reply("This feature isn't enabled, please ask your admin to enable.")
        }
    },
};
