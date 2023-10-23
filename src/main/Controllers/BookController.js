import { BookStore } from "../Models/Book.js";
import express, { Router } from 'express'

const bookRoutes = Router()
const bookStore = new BookStore()

bookRoutes.get('/', async (req, res) => {
    try {
        const books = await bookStore.index()

        return res.status(200).json(books)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
})

bookRoutes.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const book = await bookStore.show(id)

        return res.status(200).json(book)
    } catch (error) {
        return res.status(500).send(error)
    }
})
bookRoutes.get('/search/:query', async (req, res) => {
    try {
        const books = await bookStore.search(req.params.query)

        return res.status(200).json(books)
    } catch (error) {
        res.status(500).send(error)
    }
})

bookRoutes.post('/', async (req, res) => {
    try {
        const { title, author, availableQuantity, ISBN, shelfLocation } = req.body

        if (title && author && availableQuantity && ISBN && shelfLocation) {
            const book = await bookStore.create({
                title,
                author,
                availableQuantity,
                ISBN,
                shelfLocation
            })


            return res.status(201).json(book)
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
})

bookRoutes.put('/:id', async (req, res) => {
    try {
        const book = req.body
        const updatedBook = await bookStore.update(book)

        return res.status(204).json(updatedBook)
    } catch (error) {
        return res.status(500).send(error)
    }
})

bookRoutes.delete('/:id', async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).send(error)
    }
})


export default bookRoutes