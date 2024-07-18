const {eq} = require('drizzle-orm')
const {db} = require('../../lib/db/db')
const {serverSettings} = require('../../lib/db/schema')
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('ai').setDescription('Ask AI anything!')
    .addStringOption(option => { return option.setName('prompt').setDescription("What is your prompt?").setRequired(true)}),
    async execute(ctx) {
        let prompt = ctx.options.getString('prompt')
        let serverChecks = await db.select().from(serverSettings).where(eq(serverSettings.guild_id, ctx.guild.id))
        if (serverChecks.length == 0) {
            await ctx.reply({content: "AI functionality isn't currently enabled. Please contact your administrator to be able to setup this functionality.", ephemeral: true})
        } else {
            if (serverSettings[0].aiFeatures == true) {
                // AI time
                const ai = new GoogleGenerativeAI(process.env.GOOG_AI_STUDIO_TOKEN)
                const model = ai.getGenerativeModel({
                    model: "gemini-1.5-pro",
                    safetySettings: [
                        {
                            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
                        }
                    ]
                })

                let c = [{
                    parts: [
                        {text: prompt}
                    ]
                }]
                const message_returned = await model.generateContentStream({c
                })
            } else {
                await ctx.reply({content: "AI functionality isn't currently enabled. Please contact your administrator to be able to setup this functionality.", ephemeral: true})
            }
        }
    },
}