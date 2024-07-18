const {eq} = require('drizzle-orm')
const {db} = require('../../lib/db/db')
const {announcementChannel} = require('../../lib/db/schema')

const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('register').setDescription('Register for anything.').setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => {return option.setName('channel').setDescription("Channel to register").setRequired(true)}),
    async execute(ctx) {
        let s = await db.insert(announcementChannel).values({
            'channel_id': ctx.options.getChannel('channel').id,
            'guild_id': ctx.guild.id,
        })  
        await ctx.reply(`Set announcements channel to ${ctx.options.getChannel('channel')}.`)
    },
}