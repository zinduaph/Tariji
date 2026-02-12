import express from 'express'
import { getCurrentSubscription, checkSubscriptionStatus, growthPlan, proPlan, starterPlan, subscriptionCallback } from '../controller/paymentController.js'

import authMiddleware from '../middleware/auth.js'
const subscriptionRoute = express.Router()


subscriptionRoute.post('/starter',authMiddleware, starterPlan)
subscriptionRoute.post('/growth',authMiddleware,growthPlan)
subscriptionRoute.post('/pro-plan',authMiddleware ,proPlan)
subscriptionRoute.post('/callback',subscriptionCallback)
subscriptionRoute.get('/plan',authMiddleware,getCurrentSubscription)
subscriptionRoute.get('/status/:subscriptionId',authMiddleware,checkSubscriptionStatus)

export default subscriptionRoute