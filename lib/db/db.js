const {drizzle} = require('drizzle-orm/node-postgres')
const {Client} = require('pg')
const schema = require('./schema')

// Database client
export const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL?.toLowerCase() == 'true' ? true : false,
})

client.connect()

export const db = drizzle(client, {schema});