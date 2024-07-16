# Luna
*The Discord Bot created by Loom.*

Luna is an open-source Discord bot created by Loom, designed for the Loom server. It is written in Javascript using Discord.js.

## Requirements
- Node.js
- PostgreSQL

## Installation

1. Clone the repository
2. Run `bun install` to install dependencies (mainly discord.js)
3. Create a .env file to be able to store the token and other database information so Luna can configure the database properly (Luna uses Postgres).
4. After populating the .env information, run `bun run setup` to create the database tables.
4. Run `bun run cli` to start Luna.