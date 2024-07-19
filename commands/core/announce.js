const {eq} = require('drizzle-orm')
const {db} = require('../../lib/db/db')
const {announcementChannel} = require('../../lib/db/schema')

const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('announce').setDescription('Announce something to your server through the bot!').setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => {return option.setName('channel').setDescription("Channel to set as the announcements channel").setRequired(true)})
    .addStringOption(option => { return option.setName('title').setDescription("Set the title of the announcement").setRequired(true)})
    .addStringOption(option => { return option.setName('message').setDescription("Message to announce").setRequired(true)})
    .addRoleOption(option => { return option.setName('role').setDescription("Mention a role, if needed from everyone to a specific role").setRequired(false)})
    .setDMPermission(false),
    async execute(ctx) {
            try {
                if (ctx.options.getRole('role') == null) {
                    let announcementEmbed = new EmbedBuilder().setColor('#5a1882')
                    .setDescription(`${ctx.options.getString("message")}`).setTimestamp()
                    .setTitle(`${ctx.options.getString("title")}`)
                    await ctx.options.getChannel('channel').send({ embeds: [announcementEmbed]})
                } else {
                    let announcementEmbed = new EmbedBuilder().setColor('#5a1882').setDescription(`${ctx.options.getString("message")}`)
                    await ctx.options.getChannel('channel').send({content: `${ctx.options.getRole('role')}`, embeds: [announcementEmbed]})
                }
                let announcedSuccessEmbed = new EmbedBuilder().setColor('Green').setDescription('✅ Sent announcement successfully.')
                await ctx.reply({embeds: [announcedSuccessEmbed], ephemeral: true})
            } catch (e) {
                console.log(e)
                let announcedFailEmbed = new EmbedBuilder().setColor('Red').setTitle("❌ Could not successfully send announcement.").setDescription('I cannot announce in that channel since I do not have permissions set to send messages in that channel. Please assign me the role so I can announce.')
                await ctx.reply({embeds: [announcedFailEmbed], ephemeral: true})
            }
            // await ctx.options.getChannel('channel').send(``)
            // let announcementsTracking = await db.select().from(announcementChannel).where(eq(announcementChannel.guild_id, ctx.guild.id))
            // if  (announcementsTracking == 0) {
            //     await ctx.reply(`You didn't setup the delegated announcement channel! Setup one by doing /setup_announcements.`)
            // } else {
            //     console.log(ctx.channels.get(announcementsTracking[0].channel_id))
            //     await ctx.reply(`${'a'}`)
            // }
    },
}