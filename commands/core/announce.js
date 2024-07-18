const {eq} = require('drizzle-orm')
const {db} = require('../../lib/db/db')
const {announcementChannel} = require('../../lib/db/schema')

const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('announce').setDescription('Announce something to your server through the bot!').setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => {return option.setName('channel').setDescription("Channel to set as the announcements channel").setRequired(true)})
    .addStringOption(option => { return option.setName('message').setDescription("Message to announce").setRequired(true)})
    .addRoleOption(option => { return option.setName('role').setDescription("Mention a role, if needed from everyone to a specific role").setRequired(false)}),
    async execute(ctx) {
            try {
                if (ctx.options.getRole('role') == null) {
                        await ctx.options.getChannel('channel').send(ctx.options.getString('message'))
                } else {
                    await ctx.options.getChannel('channel').send(`${ctx.options.getRole('role')} ${ctx.options.getString('message')}`)
                }
                await ctx.reply("I have replied successfully.")
            } catch {
                await ctx.reply("I cannot announce in that channel since I do not have permissions set to send messages in that channel. Please assign me the role so I can announce.", ephemeral=true)
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