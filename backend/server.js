import express from 'express'
import "dotenv/config"
import cors from 'cors'
import connectDB from './config/mongoDB.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import subscriptionRoute from './routes/subscriptionRoute.js'
import productRouter from './routes/productRoute.js'
import lipaOnlineRouter from './routes/lipaOnlineRoute.js'
import router from './routes/deliveryRoute.js'
import redisClient from './config/redis.js'



const app = express()
const PORT = process.env.PORT || 8000

// middleware
app.use(express.json())
app.use(cors())
connectDB()
connectCloudinary()

redisClient.on('connect', () => {
    console.log('connected to Redis successfully')
})
 



// Routes
app.use('/api/user', userRouter)
app.use('/api/product',productRouter)
app.use('/api/subscription',subscriptionRoute)
app.use('/api/payment', lipaOnlineRouter)
app.use('/api/delivery', router)


app.get('/', (req,res) => {
    res.send('app is working')
})

app.listen(PORT, (req,res) => {
    console.log(`app in running on port ${PORT}`)
})