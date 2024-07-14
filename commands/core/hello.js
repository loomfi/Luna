const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('hello').setDescription('Say hello to Luna! 👋'),
    async execute(ctx) {
        await ctx.reply("Hello.")
    },
}