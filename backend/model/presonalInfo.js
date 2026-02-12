import mongoose from "mongoose";

const personalInfoSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    typeOfProduct: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    howDidYouHearAboutUs: { type: String, required: true }
})

const personalModel = mongoose.model('presonal', personalInfoSchema)

export default personalModel