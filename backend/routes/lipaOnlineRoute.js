import express from 'express'
import { lipaOnline, lipaOnlineCallback, checkPaymentStatus, initializePaystackCheckout, verifyPaystackCheckout, paystackCartWebhook } from '../controller/lipaOnline.js'

const lipaOnlineRouter = express.Router()

// Payment endpoint - no auth required
lipaOnlineRouter.post('/lipa-online', lipaOnline)

// Paystack checkout and confirmation
lipaOnlineRouter.post('/paystack', initializePaystackCheckout)
lipaOnlineRouter.get('/paystack/verify/:reference', verifyPaystackCheckout)
lipaOnlineRouter.post('/paystack/webhook', paystackCartWebhook)

// M-Pesa callback URL
lipaOnlineRouter.post('/lipa-online/callback', lipaOnlineCallback)

// Check payment status
lipaOnlineRouter.get('/lipa-online/status/:paymentId', checkPaymentStatus)

export default lipaOnlineRouter
