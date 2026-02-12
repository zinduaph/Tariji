import express from 'express'
import { lipaOnline, lipaOnlineCallback, checkPaymentStatus } from '../controller/lipaOnline.js'

const lipaOnlineRouter = express.Router()

// Payment endpoint - no auth required
lipaOnlineRouter.post('/lipa-online', lipaOnline)

// M-Pesa callback URL
lipaOnlineRouter.post('/lipa-online/callback', lipaOnlineCallback)

// Check payment status
lipaOnlineRouter.get('/lipa-online/status/:paymentId', checkPaymentStatus)

export default lipaOnlineRouter
