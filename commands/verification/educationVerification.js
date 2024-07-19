const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('verify').setDescription('Verify yourself through education verification (if enabled)')
    .setDMPermission(false),
    async execute(ctx) {
        await ctx.reply("Hello.")
    },
}