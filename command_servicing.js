import { REST, Routes } from 'discord.js';
import chalk from 'chalk';

const commands = [
  {
    name: 'hello',
    description: 'Say hello to Luna! 👋',
  },
  {
    name: 'server',
    description: 'Grab server information.',
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

try {
  console.log(`${chalk.cyanBright('[*]')} Reloading commands.`);

  await rest.put(Routes.applicationCommands(process.env.BOT_CLIENT_ID), { body: commands });

  console.log(`${chalk.cyanBright('[*]')} Reloaded slash commands.`);
} catch (error) {
  console.error(error);
}