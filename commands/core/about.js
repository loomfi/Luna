const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('about').setDescription('Learn more about Luna'),
    async execute(ctx) {
        let embed = new EmbedBuilder().setTitle('🌙 Luna').setDescription('Written by Loom for utilization in the discord server, Luna is an open-source discord bot that can perform announcements and do moderation actions within settings. You can also make your own commands also.')
        .setFooter({text: "Created by Loom ❤️"}).setTimestamp()
        await ctx.reply({embeds: [embed]})
    },
}