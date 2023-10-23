import Client from '../../database.js'
import bcrypt from 'bcrypt'
import signToken from '../Utils/signToken.js'
const {
    BCRYPT_PASSWORD,
    SALT_ROUNDS
} = process.env


export class BorrowerStore {
    async index() {
        try {
            const sql = 'SELECT * FROM borrowers'

            const conn = await Client.connect()
            const res = await conn.query(sql)
            conn.release()
            if (res.rows) {
                return res.rows[0]
            }

        } catch (error) {
            throw new Error('Could not fetch borrowers. \n' + error)
        }
    }

    async show(borrower_id) {
        try {
            const sql = 'SELECT * FROM borrowers where id = ($1)'

            const conn = await Client.connect()
            const res = await conn.query(sql, [borrower_id])
            conn.release()
            if (res.rows) {
                return res.rows[0]
            }

        } catch (error) {
            throw new Error('Could not fetch borrower.\n' + error)
        }
    }

    async create(borrower) {
        try {
            const sql = 'INSERT INTO borrowers (name, email, password) VALUES ($1, $2, $3) RETURNING *'
            const conn = await Client.connect()

            const hash = bcrypt.hashSync(
                borrower.password + BCRYPT_PASSWORD,
                parseInt(SALT_ROUNDS)
            )
            const res = await conn.query(sql, [borrower.name, borrower.email, hash])
            conn.release()

            if (res.rows) {
                return res.rows[0]
            }
        } catch (error) {
            console.log(error);
            throw new Error('Could not create borrower.\n' + error)
        }
    }

    async update(id, borrower) {
        try {
            const sql = `UPDATE borrowers SET name=($1), email=($2), password=($3) WHERE id =($4)`
            // const sql = `UPDATE borrowers SET name=('Amr'), email=('new'), password=('new') WHERE id =(9)`

            const conn = await Client.connect()
            const res = await conn.query(sql, [borrower.name, borrower.email, borrower.password, id])
            conn.release()
            if (res.rows) {
                return res.rows[0]
            }
        } catch (error) {
            // console.log(error);
            throw new Error('Could not update \n' + error)
        }
    }
    // RETURNS JSON WEB TOKEN TO BE USED FOR FURTHER AUTH
    async authenticate(email, password) {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM borrowers WHERE email= ($1)';
            const res = await conn.query(sql, [email]);
            conn.release();

            if (res.rows.length) {
                const borrower = res.rows[0];
                if (bcrypt.compareSync(password + BCRYPT_PASSWORD, borrower.password)) {
                    return signToken(borrower);
                }
            }
            return null;
        } catch (error) {
            throw new Error(`Unable to auth borrower.\n` + error);
        }

    }
}
