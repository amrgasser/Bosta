import Client from "../../database.js";
import { BookStore } from "./Book.js";

const bookStore = new BookStore()
export class BorrowerBookStore {
    async index() {
        try {
            const sql = 'SELECT * FROM borrower_check_book'
            const conn = await Client.connect()
            const res = await conn.query(sql)
            conn.release()
            return res.rows
        } catch (error) {
            throw new Error('could not fetch' + error)
        }
    }

    async findAllMyBooks(borrwer_id) {
        try {
            const sql = 'SELECT * FROM borrower_check_book WHERE borrower_id = ($1)'
            const conn = await Client.connect()
            const res = await conn.query(sql, [borrwer_id])
            conn.release()
            return res.rows
        } catch (error) {
            throw new Error('could not fetch' + error)
        }
    }

    async checkBook(borrower_id, book_id) {
        try {
            const conn = await Client.connect()
            //First check if the book is available and in stock
            const findBook = await bookStore.show(book_id)
            if (findBook.available_quantity === 0) {
                return { message: "Book out of Stock" }
            }

            //Check if borrower already checked out this book
            const checkAlready = 'SELECT * FROM borrower_check_book WHERE borrower_id = ($1) AND book_id = ($2) AND status != 2'
            const checkAlreadyRes = await conn.query(checkAlready, [borrower_id, book_id])
            if (checkAlreadyRes.rows.length > 0) {
                return { message: "Book already checked" }
            }


            //Check book
            const checkBook = 'INSERT INTO borrower_check_book (borrower_id, book_id, status) VALUES ($1, $2, $3) RETURNING *'
            const res = await conn.query(checkBook, [borrower_id, book_id, 1])

            //Update book quantity
            findBook.available_quantity = findBook.available_quantity - 1;
            const updatedQ = await bookStore.update(findBook)

            conn.release()
            return res.rows[0]

        } catch (error) {
            throw new Error('Could not check book' + error)
        }
    }

    async returnBook(borrower_id, book_id) {
        try {
            const conn = await Client.connect()
            //get check entry
            const checkEntrySQL = 'SELECT * FROM borrower_check_book WHERE borrower_id = ($1) AND book_id = ($2) AND status != 2'
            const checkEntry = await conn.query(checkEntrySQL, [borrower_id, book_id])
            const markEntrySQL = 'UPDATE borrower_check_book SET status = 2 where id = ($1) returning *'
            const markEntry = await conn.query(markEntrySQL, [checkEntry.id])


            const findBook = await bookStore.show(book_id);
            findBook.available_quantity = findBook.available_quantity + 1
            const updatedBook = await bookStore.update(findBook)

            conn.release()
            return { message: "Returned" }
        } catch (error) {
            throw new Error('Could not return book' + error)
        }
    }


    //EXPORT ALL OVERDUE BOOKS FROM LAST MONTH
    async exportOverdueLastMonth() {
        try {
            const conn = await Client.connect()
            const sql = `
                SELECT books.title, books.isbn, borrowers.email, borrower_check_book.created_at
                FROM borrower_check_book
                INNER JOIN borrowers ON borrower_check_book.borrower_id = borrowers.id
                INNER JOIN books ON borrower_check_book.book_id = books.id
                WHERE borrower_check_book.created_at >= date_trunc('month', current_date - interval '1' month)
                and borrower_check_book.created_at < date_trunc('month', current_date) and status = 3
            `
            const result = await conn.query(sql);

            conn.release()
            return result.rows
        } catch (error) {
            throw new Error('Could not get this data: \n' + error)
        }
    }

    //EXPORT ALL BORROWING HAPPENED IN LAST MONTH
    async exportBorrowedLastMonth() {
        try {
            const conn = await Client.connect();
            const sql = `
                select borrower_id, borrowers.email, books.title, books.isbn FROM borrower_check_book 
                INNER JOIN books ON borrower_check_book.book_id = books.id
                 INNER JOIN borrowers ON borrower_check_book.borrower_id = borrowers.id
                WHERE borrower_check_book.created_at >= date_trunc('month', current_date - interval '1' month)
                and borrower_check_book.created_at < date_trunc('month', current_date);
            `
            const result = await conn.query(sql)
            conn.release()
            return result.rows

        } catch (error) {
            throw new Error('Could not get this data: \n' + error)

        }
    }

    // GET THE STATISTICS FOR EACH BOOK (HOW MANY WERE BORROWED)
    async exportMostBorrowedBooksLastMonth() {
        try {
            const conn = await Client.connect()
            const sql = `
                select books.id , books.title, count(*) FROM books INNER JOIN borrower_check_book ON borrower_check_book.book_id = books.id 
                WHERE borrower_check_book.created_at >= date_trunc('month', current_date - interval '1' month)
                and borrower_check_book.created_at < date_trunc('month', current_date)
                Group by books.id
            `
            const result = await conn.query(sql);



            conn.release()
            return result.rows
        } catch (error) {
            throw new Error('Could not get this data: \n' + error)
        }
    }


}
