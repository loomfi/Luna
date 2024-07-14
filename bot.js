const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
import * as fs from 'fs';
import * as path from 'path';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const folderPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(folderPath)

for (const folder of commandFolders) {
    const cPath = path.join(folderPath, folder)
    const cFiles = fs.readdirSync(cPath).filter(file => file.endsWith('.js'))
    for (const file of cFiles) {
        const filePath = path.join(cPath, file);
		const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`[SERVER] [W]: Command in file at ${filePath} is missing "data" or "execute".`)
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
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

client.on('ready', (value) => {
    console.log(`[SERVER] Logged in as ${value.user.displayName}!`)
})

client.login(process.env.BOT_TOKEN);