import express from 'express'
import { getCurrentSubscription, checkSubscriptionStatus, growthPlan, proPlan, starterPlan, subscriptionCallback, paystackWebhook, verifyPaystackPayment } from '../controller/paymentController.js'

import authMiddleware from '../middleware/auth.js'
const subscriptionRoute = express.Router()


subscriptionRoute.post('/starter',authMiddleware, starterPlan)
subscriptionRoute.post('/growth',authMiddleware,growthPlan)
subscriptionRoute.post('/pro-plan',authMiddleware ,proPlan)
subscriptionRoute.post('/callback',subscriptionCallback)
subscriptionRoute.post('/paystack/webhook', paystackWebhook)
subscriptionRoute.get('/plan',authMiddleware,getCurrentSubscription)
subscriptionRoute.get('/status/:subscriptionId',authMiddleware,checkSubscriptionStatus)
subscriptionRoute.get('/paystack/verify/:reference', authMiddleware, verifyPaystackPayment)

export default subscriptionRoute