import dotenv from 'dotenv'
import pg from 'pg'
const { Pool } = pg

dotenv.config()
const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    // POSTGRES_PORT,
    NODE_ENV
} = process.env

let client = new Pool({
    host: POSTGRES_HOST,
    database: NODE_ENV === 'test' ? POSTGRES_DB_TEST : POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    // port: POSTGRES_PORT
});

export default client