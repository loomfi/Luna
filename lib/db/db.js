const {drizzle} = require('drizzle-orm/node-postgres')
const {Client} = require('pg')
const schema = require('./schema')

// Database client
export const client = new Client({
    host: process.env.db_host,
    port: Number(process.env.db_port),
    user: process.env.db_username,
    password: process.env.db_password,
    database: process.env.db_name,
    ssl: process.env.db_ssl_enabled?.toLowerCase() == 'true' ? true : false,
})

client.connect()

export const db = drizzle(client, {schema});