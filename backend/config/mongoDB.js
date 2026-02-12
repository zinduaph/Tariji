import mongoose from "mongoose";
import  Mongoose  from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('mongoDB connected')
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/tariji`)
}
export default connectDB