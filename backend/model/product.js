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
    downloadUrl: { type: String }, // Secure download link for digital products
    downloadExpiry: { type: Number, default: 7 }, // Days until link expires
    fileSize: { type: String }, // Optional file size display
    fileFormat: { type: String } // Optional file format (PDF, ZIP, etc.)
})

const ProductModel = mongoose.model('product', productSchema)
export default ProductModel