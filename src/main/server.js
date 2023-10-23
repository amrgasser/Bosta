import express from 'express'
import 'dotenv/config'
import bookRoutes from './Controllers/BookController.js'
import borrowerRoutes from './Controllers/BorrowerController.js'
import borrowerBookRoutes from './Controllers/CheckController.js'
import bodyParser from 'body-parser'
import updateDB from './Utils/UpdateDatabaseOverdue.js'

const run = () => {
    const app = express()
    app.use(bodyParser.json())

    // Initialize cronjob to automatically update table once at 12 AM everyday for overdue books
    updateDB()
    app.use('/books', bookRoutes)
    app.use('/borrowers', borrowerRoutes)
    app.use('/check', borrowerBookRoutes)
    app.listen(3000, () => {
        console.log('Server started');
    })
}

export default run