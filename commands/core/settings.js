const { SlashCommandBuilder, Events, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { eq } = require('drizzle-orm');
const { db } = require('../../lib/db/db');
const { serverSettings } = require('../../lib/db/schema');

module.exports = {
    name: Events.InteractionCreate,
    data: new SlashCommandBuilder().setName('settings').setDescription('Edit Luna guild settings.').setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
    async execute(ctx) {
        let currentServerSettings = await db.select().from(serverSettings).where(eq(serverSettings.guild_id, ctx.guild.id));
        let selectedFeatureFlag;
        let enable_button = new ButtonBuilder().setCustomId('enable_feature').setLabel('Enable Feature').setStyle(ButtonStyle.Success).setDisabled(true);
        let disable_button = new ButtonBuilder().setCustomId('disable_feature').setLabel('Disable Feature').setStyle(ButtonStyle.Danger).setDisabled(true);
        let select_options = new StringSelectMenuBuilder().setCustomId('settings_select').setPlaceholder('⚙️ Choose an option to change')
            .addOptions(
                new StringSelectMenuOptionBuilder().setLabel('🤖 AI Chat').setDescription("Be able to chat with an AI.").setValue("ai_select"),
                new StringSelectMenuOptionBuilder().setLabel('📝 Education Verification').setDescription("Verify an individual being of a school with their education status through handlers.").setValue("education_verification_select"),
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
                    selectedFeatureFlag = 'ai_select';
                    const optionsActionRow = new ActionRowBuilder().addComponents(select_options);
                    const buttonActionRow = new ActionRowBuilder().addComponents(disable_button, enable_button);

                    const editEmbed = new EmbedBuilder()
                        .setColor('Aqua')
                        .setTitle("🤖 AI Chat")
                        .setDescription("Enable or Disable being able to chat with Gemini.")
                        .setFooter({ text: (currentServerSettings[0].aiFeatures) ? "✅ This feature is currently enabled." : "❌ This feature is currently disabled." });

                    await i.update({ embeds: [editEmbed], components: [optionsActionRow, buttonActionRow], content: '' });
                } else if (selectedOption == 'education_verification_select') {
                    selectedFeatureFlag = 'education_verification_select';
                    enable_button.setDisabled(currentServerSettings[0].educationVerificationFeatures).setCustomId('enable_feature');
                    disable_button.setDisabled(!currentServerSettings[0].educationVerificationFeatures).setCustomId('disable_feature');
                    select_options.setPlaceholder('📝 Education Verification');
                    const optionsActionRow = new ActionRowBuilder().addComponents(select_options);
                    const buttonActionRow = new ActionRowBuilder().addComponents(disable_button, enable_button);
                    const editEmbed = new EmbedBuilder()
                        .setColor('Greyple')
                        .setTitle("📝 Education Verification")
                        .setDescription("Verify an individual being of a school with their education status through handlers.")
                        .setFooter({ text: (currentServerSettings[0].educationVerificationFeatures) ? "✅ This feature is currently enabled." : "❌ This feature is currently disabled." });
                    await i.update({ embeds: [editEmbed], components: [optionsActionRow, buttonActionRow], content: '' });
                }
            } else if (i.isButton()) {
                let customId = i.customId;
                // Cause initial DB updates
                if (selectedFeatureFlag == 'ai_select') {
                    if (customId === 'enable_feature') {
                        currentServerSettings[0].aiFeatures = true;
                        await db.update(serverSettings).set({ aiFeatures: true }).where(eq(serverSettings.guild_id, ctx.guild.id));
                    } else if (customId === 'disable_feature') {
                        currentServerSettings[0].aiFeatures = false;
                        await db.update(serverSettings).set({ aiFeatures: false }).where(eq(serverSettings.guild_id, ctx.guild.id));
                    }
                } else if (selectedFeatureFlag == 'education_verification_select') {
                    if (customId === 'enable_feature') {
                        currentServerSettings[0].educationVerificationFeatures = true;
                        await db.update(serverSettings).set({ educationVerificationFeatures: true }).where(eq(serverSettings.guild_id, ctx.guild.id));
                    } else if (customId === 'disable_feature') {
                        currentServerSettings[0].educationVerificationFeatures = false;
                        await db.update(serverSettings).set({ educationVerificationFeatures: false }).where(eq(serverSettings.guild_id, ctx.guild.id));
                    }
                }

                // Cause the rerenders
                currentServerSettings = await db.select().from(serverSettings).where(eq(serverSettings.guild_id, ctx.guild.id));
                if (selectedFeatureFlag == 'ai_select') {
                    enable_button.setDisabled(currentServerSettings[0].aiFeatures);
                    disable_button.setDisabled(!currentServerSettings[0].aiFeatures);
                    const editEmbed = new EmbedBuilder()
                        .setColor('Aqua')
                        .setTitle("🤖 AI Chat")
                        .setDescription("Enable or Disable being able to chat with Gemini.")
                        .setFooter({ text: (currentServerSettings[0].aiFeatures) ? "✅ This feature is currently enabled." : "❌ This feature is currently disabled." });

                    await i.update({ embeds: [editEmbed], components: [optionsActionRow, buttonActionRow], content: '' });
                } else if (selectedFeatureFlag == 'education_verification_select') {
                    enable_button.setDisabled(currentServerSettings[0].educationVerificationFeatures);
                    disable_button.setDisabled(!currentServerSettings[0].educationVerificationFeatures);
                    const editEmbed = new EmbedBuilder()
                        .setColor('Greyple')
                        .setTitle("📝 Education Verification")
                        .setDescription("Verify an individual being of a school with their education status through handlers.")
                        .setFooter({ text: (currentServerSettings[0].educationVerificationFeatures) ? "✅ This feature is currently enabled." : "❌ This feature is currently disabled." });

                    await i.update({ embeds: [editEmbed], components: [optionsActionRow, buttonActionRow], content: '' });
                }
            }
        });
    },
};
