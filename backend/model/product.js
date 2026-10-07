import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    date: { type: Number, required: true },
    userId: { type: String, required: true },
    // Digital product fields
    productType: { 
        type: String, 
        enum: ['physical', 'ebook', 'course', 'template', 'digital'],
        default: 'physical'
    },
    pdfFile: {type: String,
             publicId: String, // Store the public ID for Cloudinary
             originalName:String, // Store the original file name
    },
    downloadUrl: { type: String },
    downloadPublicId: { type: String },
    downloadResourceType: { type: String },
    downloadFormat: { type: String },
    downloadExpiry: { type: Number, default: 48 }, // Hours until link expires
    fileSize: { type: String }, // Optional file size display
    fileFormat: { type: String } // Optional file format (PDF, ZIP, etc.)
})

const ProductModel = mongoose.model('product', productSchema)
export default ProductModel