const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('server').setDescription('Grab server information.').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(ctx) {
        let serverInfoEmbed = new EmbedBuilder().setColor('#2abdde')
        .setTitle(`Server information for ${ctx.guild.name}`)
        .addFields(
            {'name': "Name", value: `<@${ctx.guild.ownerID}>`},
            {'name': "Server population", value: `${ctx.guild.memberCount} members.`},
        )
        await ctx.reply({ embeds: [serverInfoEmbed]})
    },
}