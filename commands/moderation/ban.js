const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { eq } = require('drizzle-orm');
const { db } = require('../../lib/db/db');
const { serverSettings } = require('../../lib/db/schema');

module.exports = {
    data: new SlashCommandBuilder().setName('ban').setDescription('Ban a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => option.setName('user').setDescription("User to ban").setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription("Reason for ban").setRequired(false))
        .addBooleanOption(option => option.setName('delete_messages').setDescription("Purge all messages").setRequired(false))
        .addBooleanOption(option => option.setName('force').setDescription("Bypass confirmation and immediately ban").setRequired(false))
        .setDMPermission(false),
    
    async execute(ctx) {
        let serverPermissions = await db.select().from(serverSettings).where(eq(serverSettings.guild_id, ctx.guild.id));
        if (serverPermissions[0].moderationFeatures == true) {
            const tMember = await ctx.guild.members.fetch(ctx.options.getUser('user').id);
            const reason = ctx.options.getString('reason') || 'No reason has been given';
            const deleteMessages = ctx.options.getBoolean('delete_messages') || false;
            await ctx.deferReply()
            if (ctx.options.getUser('user').id === ctx.user.id) {
                return await ctx.editReply({ content: 'You cannot ban yourself.', components: [], embeds: [] });
            }

            if (ctx.member.roles.highest.position <= tMember.roles.highest.position) {
                return await ctx.editReply({ content: 'You cannot ban this person.', components: [], embeds: [] });
            }

            const botMember = await ctx.guild.members.fetchMe();
            if (botMember.roles.highest.position <= tMember.roles.highest.position) {
                return await ctx.editReply({ content: 'I cannot ban this person.', components: [], embeds: [] });
            }

            const banUser = async () => {
                if (deleteMessages) {
                    let messages = await ctx.channel.messages.fetch();
                    messages = messages.filter(m => m.author.id === ctx.options.getUser('user').id);
                    await ctx.channel.bulkDelete(messages);
                }

                try {
                    let banEmbed = new EmbedBuilder().setTitle("Banned.").setDescription(`Hello! You have been banned from ${ctx.guild.name} ${(reason) ? `for ${reason}` : ''}`);
                    await ctx.options.getUser('user').send({ embeds: [banEmbed] });
                } catch (err) {
                }

                await ctx.guild.members.ban(ctx.options.getUser('user'), { reason });
                return "Done"
            };

            if (ctx.options.getBoolean('force')) {
                let banStatus = await banUser();
                if (banStatus == 'Done') {
                    return ctx.editReply("Done!")
                }
            } else {
                    let confirmationButton = new ButtonBuilder().setCustomId('confirm').setLabel('☢️ Confirm Ban').setStyle(ButtonStyle.Danger);
                    let cancelButton = new ButtonBuilder().setCustomId('cancel').setLabel('❌ Cancel').setStyle(ButtonStyle.Success);
                    let banEmbed = new EmbedBuilder().setTitle("Are you sure you would like to ban?").setDescription(`Please confirm whether or not you would like to ban ${ctx.options.getUser('user')} ${reason ? `for reason ${reason}` : ''}`);
                    let actionRow = new ActionRowBuilder().setComponents(confirmationButton, cancelButton);
                    let response = await ctx.editReply({ embeds: [banEmbed], components: [actionRow] });

                    const cfilter = i => i.user.id === ctx.user.id;
                    try {
                        const conf = await response.awaitMessageComponent({ filter: cfilter, time: 60_000 });
                        if (conf.customId == 'cancel') {
                            return await conf.update({ content: 'Canceled the ban.', components: [], embeds: [] });
                        } else if (conf.customId == 'confirm') {
                            let banStatus = await banUser();
                            if (banStatus == 'Done') {
                                return conf.update({content: "Done!", components: [], embeds: []})
                            }            
                        }
                    } catch (e) {
                        console.log(e)
                        await ctx.editReply({ content: 'Cancelling due to one minute being over.', components: [], embeds: [] });
                    }
                }
        } else {
            await ctx.reply("This feature isn't enabled, please ask your admin to enable.")
        }
    },
};
