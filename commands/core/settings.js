const { SlashCommandBuilder, Events, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');
const { eq } = require('drizzle-orm');
const { db } = require('../../lib/db/db');
const { serverSettings } = require('../../lib/db/schema');

module.exports = {
    name: Events.InteractionCreate,
    data: new SlashCommandBuilder().setName('settings').setDescription('Edit Luna guild settings.').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(ctx) {
        let currentServerSettings = await db.select().from(serverSettings).where(eq(serverSettings.guild_id, ctx.guild.id));
        let enable_button = new ButtonBuilder().setCustomId('enable_feature').setLabel('Enable Feature').setStyle(ButtonStyle.Success).setDisabled(true);
        let disable_button = new ButtonBuilder().setCustomId('disable_feature').setLabel('Disable Feature').setStyle(ButtonStyle.Danger).setDisabled(true);
        let select_options = new StringSelectMenuBuilder().setCustomId('settings_select').setPlaceholder('⚙️ Choose an option to change')
            .addOptions(
                new StringSelectMenuOptionBuilder().setLabel('🤖 AI Chat').setDescription("Be able to chat with an AI.").setValue("ai_select"),
                new StringSelectMenuOptionBuilder().setLabel('📝 Tracking').setDescription("Have this server tracked for idk why.").setValue("tracking_select"),
            );

        const optionsActionRow = new ActionRowBuilder().addComponents(select_options);
        const buttonActionRow = new ActionRowBuilder().addComponents(disable_button, enable_button);
        let response = await ctx.reply({ content: "Welcome to the Settings Editor 📝", components: [optionsActionRow, buttonActionRow] });

        const collector = response.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.isStringSelectMenu()) {
                let selectedOption = i.values[0];
                if (selectedOption === 'ai_select') {
                    enable_button.setDisabled(currentServerSettings[0].aiFeatures).setCustomId('enable_feature');
                    disable_button.setDisabled(!currentServerSettings[0].aiFeatures).setCustomId('disable_feature');
                    select_options.setPlaceholder('🤖 AI Chat');
                    
                    const optionsActionRow = new ActionRowBuilder().addComponents(select_options);
                    const buttonActionRow = new ActionRowBuilder().addComponents(disable_button, enable_button);

                    const editEmbed = new EmbedBuilder()
                        .setColor('Aqua')
                        .setTitle("🤖 AI Chat")
                        .setDescription("Enable or Disable being able to chat with Gemini.")
                        .setFooter({ text: `${(currentServerSettings[0].aiFeatures) ? "✅ This feature is currently enabled." : "❌ This feature is currently disabled."}` });

                    await i.update({ embeds: [editEmbed], components: [optionsActionRow, buttonActionRow], content: '' });
                }
            } else if (i.isButton()) {
                let customId = i.customId;
                if (customId === 'enable_feature') {
                    currentServerSettings[0].aiFeatures = true;
                    await db.update(serverSettings).set({ aiFeatures: true }).where(eq(serverSettings.guild_id, ctx.guild.id));
                } else if (customId === 'disable_feature') {
                    currentServerSettings[0].aiFeatures = false;
                    await db.update(serverSettings).set({ aiFeatures: false }).where(eq(serverSettings.guild_id, ctx.guild.id));
                }
                enable_button.setDisabled(currentServerSettings[0].aiFeatures);
                disable_button.setDisabled(!currentServerSettings[0].aiFeatures);

                const editEmbed = new EmbedBuilder()
                    .setColor('Aqua')
                    .setTitle("🤖 AI Chat")
                    .setDescription("Enable or Disable being able to chat with Gemini.")
                    .setFooter({ text: `${(currentServerSettings[0].aiFeatures) ? "✅ This feature is currently enabled." : "❌ This feature is currently disabled."}` });

                await i.update({ embeds: [editEmbed], components: [optionsActionRow, buttonActionRow], content: '' });
            }
        });
    },
};
