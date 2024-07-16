const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { ActivityType, Emoji, REST, Routes } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const folderPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(folderPath)
// @ts-ignore
let commands = [];
// @ts-ignore
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

for (const folder of commandFolders) {
    const cPath = path.join(folderPath, folder)
    const cFiles = fs.readdirSync(cPath).filter(file => file.endsWith('.js'))
    for (const file of cFiles) {
        const filePath = path.join(cPath, file);
		const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON())
        } else {
            console.warn(`${chalk.greenBright('[SERVER]')} [W]: Command in file at ${filePath} is missing "data" or "execute".`)
        }
    }
}

async function registerCommands() {
    try {
        console.log(`${chalk.greenBright('[SERVER]')} ${chalk.cyanBright('[Command Handler]')} Reloading slash commands.`);
        // @ts-ignore
        await rest.put(Routes.applicationCommands(process.env.BOT_CLIENT_ID), { body: commands });
        console.log(`${chalk.greenBright('[SERVER]')} ${chalk.cyanBright('[Command Handler]')} Reloaded slash commands.`);
    } catch (error) {
      console.error(error);
    }
}

client.on(Events.InteractionCreate, async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        return;
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: 'Some error had occured when this command was ran', ephemeral: true})
        } else {
            await interaction.reply({content: 'Some error had occured when this command was ran', ephemeral: true})
        }
    }
})

client.on('ready', async (value: any) => {
    console.log(`${chalk.greenBright('[SERVER]')} Logged in as ${value.user.displayName}!`)
    await registerCommands();
    console.log(`${chalk.greenBright('[SERVER]')} Created status.`)
    client.user.setPresence({
        status: 'idle',
        activities: [{name: "the moon. 🌙", type: ActivityType.Listening}]
    })
})

client.login(process.env.BOT_TOKEN);