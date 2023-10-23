import express, { Router } from 'express'
import { BorrowerBookStore } from '../Models/BorrowerBook.js'
import ExportToExcel from '../Utils/ExportToExcel.js'
import rateLimiter from '../Middleware/rateLimiter.js';
const borrowerBookStore = new BorrowerBookStore();
const borrowerBookRouter = Router()

// get all checked books
borrowerBookRouter.get('/', async (req, res) => {
    try {
        const { borrowerId } = req.body;
        let list;
        if (borrowerId) {
            list = await borrowerBookStore.findAllMyBooks(borrowerId)
        } else {
            list = await borrowerBookStore.index()
        }

        return res.status(200).json(list)
    } catch (error) {

    }
})
///CHECK A BOOK
borrowerBookRouter.post('/', async (req, res) => {
    try {
        const { borrower_id, book_id } = req.body
        const result = await borrowerBookStore.checkBook(borrower_id, book_id)
        if (result.message) {
            res.status(409).json(result)
        }
        return res.status(201).json(result)
    } catch (error) {

    }
})
//RETURN A BOOK
borrowerBookRouter.put('/', async (req, res) => {
    try {
        const { borrower_id, book_id } = req.body
        const result = await borrowerBookStore.returnBook(borrower_id, book_id)
        // if (result.message) {
        //     res.status(409).json(result)
        // }
        return res.status(201).json(result.message)
    } catch (error) {

    }
})

borrowerBookRouter.get('/book-statistics', async (req, res) => {
    try {
        const data = await borrowerBookStore.exportOverdueLastMonth()
        const xlsx = await ExportToExcel(data)

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        res.setHeader(
            "Content-Disposition",
            "attachment;filename=books-statistics.xlsx"
        )
        xlsx.write(res)
    } catch (error) {

    }
})
borrowerBookRouter.get('/borrowing-statistics', rateLimiter({ timeAllowed: 20, numberOfHits: 2 }), async (req, res) => {
    try {
        const data = await borrowerBookStore.exportBorrowedLastMonth()
        const xlsx = await ExportToExcel(data)

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        res.setHeader(
            "Content-Disposition",
            "attachment;filename=borrowing-statistics.xlsx"
        )
        xlsx.write(res)
    } catch (error) {

    }
})
borrowerBookRouter.get('/overdue-statistics', rateLimiter({ timeAllowed: 20, numberOfHits: 2 }), async (req, res) => {
    try {
        const data = await borrowerBookStore.exportOverdueLastMonth()
        const xlsx = await ExportToExcel(data)

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        res.setHeader(
            "Content-Disposition",
            "attachment;filename=overdue-statistics.xlsx"
        )
        xlsx.write(res)
    } catch (error) {

    }
})




export default borrowerBookRouter