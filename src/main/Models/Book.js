import { log } from 'console'
import Client from '../../database.js'
import redisClient from '../../redis-client.js'

export class BookStore {
    //GET ALL BOOKKS
    async index() {
        try {

            const keys = await redisClient.keys('book_id:*')
            const books = await redisClient.MGET(keys)
            if (books.length > 0) {
                let newBooks = []
                for (let i = 0; i < books.length; i++) {
                    newBooks.push(JSON.parse(books[i]))
                }
                return newBooks
            } else {
                const conn = await Client.connect();
                const sql = 'Select * FROM books'
                const res = await conn.query(sql);

                res.rows.map(async (book) => {
                    try {
                        const id = book.id
                        await redisClient.set("book_id:" + id, JSON.stringify(book));
                    } catch (error) {
                    }
                })
                conn.release()
                if (res.rows)
                    return res.rows
            }
        } catch (error) {
            throw new Error('No books found ' + error)
        }
    }
    // GET A SINGLE BOOK BY ID
    async show(bookId) {
        try {
            const conn = await Client.connect();
            const sql = 'Select * FROM books WHERE id=($1)'
            const res = await conn.query(sql, [bookId])
            conn.release();

            if (res.rows) {
                return res.rows[0]
            }
        } catch (error) {
            throw new Error('No books found' + error)
        }
    }
    //CREATE A NEW BOOK
    async create(book) {
        try {
            const sql = 'INSERT INTO books (title, author, ISBN, available_quantity, shelf_location) VALUES ($1, $2, $3, $4, $5) RETURNING *'
            const conn = await Client.connect();

            const res = await conn.query(sql, [book.title, book.author, book.ISBN, book.availableQuantity, book.shelfLocation]);
            const newBook = res.rows[0]
            await redisClient.set("book_id:" + newBook.id, JSON.stringify(newBook))

            conn.release()
            return newBook
        } catch (error) {
            throw new Error('Could not create book ' + error)
        }
    }

    async delete(bookId) {
        try {
            const sql = `DELETE FROM books WHERE id=($1)`
            const conn = await Client.connect()
            const res = await conn.query(sql, [bookId])
            conn.release()

            if (res.rows) {
                const book = res.rows[0]
                return book
            }
        } catch (error) {
            throw new Error('Could not delete book')
        }
    }

    async update(book) {
        try {
            console.log(book.id);
            const sql = `UPDATE books SET  title = ($1), author = ($2), ISBN = ($3), available_quantity = ($4), shelf_location = ($5) WHERE id = ($6) returning *`
            const conn = await Client.connect()
            const res = await conn.query(sql, [book.title, book.author, book.isbn, book.available_quantity, book.shelf_location, book.id])
            conn.release()
            if (res.rows) {
                return res.rows[0]
            }

        } catch (error) {
            throw new Error('Could not update book')
        }
    }
    //SEARCH FOR A BOOK BY TITLE, ISBN OR AUTHOR
    async search(query) {
        try {
            const sql = `
                SELECT * FROM books
                WHERE title LIKE '%${query}'
                OR IBSN LIKE '${query}'
                OR author LIKE ${query}'
            `
            const conn = await Client.connect()
            const res = conn.query(sql)
            conn.release()
            if (res.rows) {
                return res.rows
            }

        } catch (error) {
            throw new Error('No books found')
        }
    }
}