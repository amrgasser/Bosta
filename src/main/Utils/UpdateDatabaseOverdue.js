import cron from 'node-cron'
import Client from '../../database.js';
const run = async () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            const selectAllOverdue = `
                UPDATE BORROWER_CHECK_BOOK SET status = 3
                from (select * from BORROWER_CHECK_BOOK where status = 1 AND created_at < current_date - interval '3 days') as temp_table
                where BORROWER_CHECK_BOOK.id = temp_table.id returning *;
            `
            const conn = await Client.connect()
            await conn.query(sql);
            conn.release()
        } catch (error) {
            throw new Error('Unable to update table \n' + error)
        }

    });
}

export default run