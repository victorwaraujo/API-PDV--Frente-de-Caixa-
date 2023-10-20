import dotenv from 'dotenv'
import knex from 'knex'
dotenv.config()

const client = knex({
  client: 'pg',
  connection: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
})

export default client
