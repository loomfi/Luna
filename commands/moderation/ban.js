const {SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder} = require('discord.js')
const { eq } = require('drizzle-orm');
const { db } = require('../../lib/db/db');
const { serverSettings } = require('../../lib/db/schema');

module.exports = {
    data: new SlashCommandBuilder().setName('ban').setDescription('Ban a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => { return option.setName('user').setDescription("User to ban").setRequired(true)})
    .addStringOption(option => { return option.setName('reason').setDescription("Reason for ban").setRequired(false)})
    .addBooleanOption(option => { return option.setName('delete_messages').setDescription("Purge all messages").setRequired(false)})
    .addBooleanOption(option => { return option.setName('force').setDescription("Bypass confirmation and immediately ban").setRequired(false)})
    .setDMPermission(false),
    async execute(ctx) {
        let serverPermissions = await db.select().from(serverSettings).where(eq(serverSettings.guild_id, ctx.guild.id));
        if (serverPermissions[0].moderationFeatures == true) {
            let confirmationButton = new ButtonBuilder().setCustomId('confirm').setLabel('☢️ Confirm Ban').setStyle(ButtonStyle.Danger)
            let cancelButton = new ButtonBuilder().setCustomId('cancel').setLabel('❌ Cancel').setStyle(ButtonStyle.Success)
            let banEmbed = new EmbedBuilder().setTitle("Are you sure you would like to ban?").setDescription(`Please confirm whether or not that you would like to ban ${ctx.options.getUser("user")} ${(ctx.options.getString("reason") == null) ? '':`for reason ${ctx.options.getString("reason")}`}`)
            let actionRow = new ActionRowBuilder().setComponents(confirmationButton, cancelButton)
            let response = await ctx.reply({embeds: [banEmbed], components: [actionRow]})
            const cfilter = i => i.user.id === ctx.user.id
            try {
                const conf = await response.awaitMessageComponent({filter: cfilter, time: 60_000})
                if (conf.customId == 'cancel') {
                    await InteractionCollector.editReply({content: 'Canceled the ban.', components: [], embeds: []})
                } else if (conf.customId == 'confirm') {
                    if (ctx.options.getUser("user").id === ctx.user.id) {
                        return await ctx.editReply({content: 'You cannot ban yourself.', components: [], embeds: []})
                    }
                    if (!ctx.options.getUser("user").bannable) {
                        return await ctx.editReply({content: 'I cannot ban this person.', components: [], embeds: []})
                    }
                    else {
                        
                    }
                }
                console.log()
            } catch (e) {
                console.log(e)
                await ctx.editReply({content: 'Cancelling due to one minute being over.', components: [], embeds: []})
            }
        }
    },
}