// This exists
// const {eq} = require('drizzle-orm')
// const {db} = require('../../lib/db/db')
// const {announcementChannel} = require('../../lib/db/schema')

// const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')

// module.exports = {
//     data: new SlashCommandBuilder().setName('setup_announcements').setDescription('Setup an announcement channel for announcements.').setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
//     .addChannelOption(option => {return option.setName('channel').setDescription("Channel to set as the announcements channel").setRequired(true)}),
//     async execute(ctx) {
//         let announcementsTracking = await db.select().from(announcementChannel).where(eq(announcementChannel.guild_id, ctx.guild.id))
//         if  (announcementsTracking == 0) {
//             await db.insert(announcementChannel).values({
//                 'guild_id': ctx.options.getChannel('channel').id,
//                 'channel_id': ctx.guild.id,
//             })  
//             await ctx.reply(`Set announcements channel to ${ctx.options.getChannel('channel')}.`)
//         } else {
//             await db.update(announcementChannel).values({
//                 'guild_id': ctx.options.getChannel('channel').id
//             }).where(eq(announcementChannel.guild_id, ctx.guild.id))
//             await ctx.reply("Updated!", ephemeral=true)
//         }
//     },
// }