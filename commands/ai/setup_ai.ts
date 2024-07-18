// const {eq} = require('drizzle-orm')
// const {db} = require('../../lib/db/db')
// const {serverSettings} = require('../../lib/db/schema')

// const {SlashCommandBuilder, PermissionFlagsBits, Events} = require('discord.js')

// module.exports = {
//     data: new SlashCommandBuilder().setName('setup_ai').setDescription('Add or remove AI functionality to your server so people can do /ai.').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
//     async execute(ctx) {
//         let serverChecks = await db.select().from(serverSettings).where(eq(serverSettings.guild_id, ctx.guild.id))
//         if (serverChecks.length == 0) {
//             await db.insert(serverSettings).values({
//                 'guild_id': ctx.guild.id,
//                 'aiFeatures': true
//             })
//             await ctx.reply("Enabled AI Features, go have fun with /ai.")
//         } else {
//             if (serverChecks[0].aiFeatures == true) {
//                 await db.update(serverSettings).set({
//                     'aiFeatures': false
//                 }).where(eq(serverSettings.guild_id, ctx.guild.id))
//                 await ctx.reply("Disabled AI Features.")
//             } else {
//                 await db.update(serverSettings).set({
//                     'aiFeatures': true
//                 }).where(eq(serverSettings.guild_id, ctx.guild.id))
//                 await ctx.reply("Enabled AI Features, go have fun with /ai.")
//             }
//         }
//     },
// }