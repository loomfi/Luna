const {eq} = require('drizzle-orm')
const {db} = require('../../lib/db/db')
const {serverSettings} = require('../../lib/db/schema')
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('ai').setDescription('Ask AI anything!')
    .addStringOption(option => { return option.setName('prompt').setDescription("What is your prompt?").setRequired(true)})
    .setDMPermission(false),
    async execute(ctx) {
        try {
            await ctx.deferReply()
            let serverChecks = await db.select().from(serverSettings).where(eq(serverSettings.guild_id, ctx.guild.id))
            if (serverChecks.length == 0) {
                await ctx.reply({content: "AI functionality isn't currently enabled. Please contact your administrator to be able to setup this functionality.", ephemeral: true})
            } else {
                if (serverChecks[0].aiFeatures == true) {
                    // AI time
                    const ai = new GoogleGenerativeAI(process.env.GOOG_AI_STUDIO_TOKEN)
                    const model = ai.getGenerativeModel({
                        model: "gemini-1.5-flash",
                        safetySettings: [
                            {
                                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
                            }
                        ]
                    })
                    let prompt = ctx.options.getString("prompt")
                    let init_result = await model.generateContent(prompt);
                    let result = init_result.response.text();
                    await ctx.editReply({content: result})
                } else {
                    await ctx.editReply({content: "AI functionality isn't currently enabled. Please contact your administrator to be able to setup this functionality.", ephemeral: true})
                }
            }
        } catch (e) {
            console.log(e)
            await ctx.editReply({content: "Apologies, but it seems that either the bot has either exhausted its queries, its an issue on Googles' side, or is a message 2000 words or longer that can't be sent. Please wait a bit before trying again.", ephemeral: true})
        }
    },
}