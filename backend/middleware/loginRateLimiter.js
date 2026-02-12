

import rateLimit, { ipKeyGenerator } from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import redisClient from '../config/redis.js'

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args)
    }),
    keyGenerator: (req) => {
        return `${ipKeyGenerator(req)}-${req.body.email}`
    },
    message: {
        success: false,
        message: 'Too many login attempts. Try again later.'
    }
})
