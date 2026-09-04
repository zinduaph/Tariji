import express from "express"
import { AddAccount, getAccount } from "../controller/accountController.js"
import authMiddleware from "../middleware/auth.js"

const AccountRouter = express.Router()

AccountRouter.post('/add-account', authMiddleware, AddAccount)
AccountRouter.get('/get-account', authMiddleware, getAccount)

export default AccountRouter