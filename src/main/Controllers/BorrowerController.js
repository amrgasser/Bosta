import verifyToken from "../Middleware/verifyToken.js";
import { BorrowerStore } from "../Models/Borrower.js";
import express, { Router } from 'express'


const borrowerRoutes = Router()
const borrowerStore = new BorrowerStore();

borrowerRoutes.get('/', async (req, res) => {
    try {
        const borrowers = await borrowerStore.index()

        return res.status(200).json(borrowers)
    } catch (error) {
        return res.status(500).send(error)
    }
})

borrowerRoutes.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const borrower = await borrowerStore.show(id);

        return res.status(200).json(borrower)
    } catch (error) {
        return res.status(500).send(error)
    }
})

borrowerRoutes.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const borrower = {
            name,
            email,
            password
        }
        const newBorrower = await borrowerStore.create(borrower)
        return res.status(201).json(newBorrower)
    } catch (error) {
        return res.status(500).send(error)
    }
})

borrowerRoutes.post('/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body
        const token = await borrowerStore.authenticate(email, password)
        console.log(token);
        if (token) {
            return res.status(200).json({ token })
        } else {
            return res.status(401).json({ message: 'Invalid email or password' })
        }
    } catch (error) {
        return res.status(500).send(error)
    }
})


borrowerRoutes.put('/:id', verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const borrower = await borrowerStore.update(id, req.body)

        return res.status(204).json(borrower)
    } catch (error) {
        return res.status(500).send(error)
    }
})

export default borrowerRoutes