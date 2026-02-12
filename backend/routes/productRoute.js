import express from 'express'
import { addProduct, listProduct, uploadImages, getVendorProducts, getProductsByVendor } from '../controller/productController.js'
import authMiddleware from '../middleware/auth.js'

const productRouter = express.Router()

productRouter.post('/add',authMiddleware,uploadImages,addProduct)
productRouter.get('/list',listProduct)
productRouter.get('/my-products', authMiddleware, getVendorProducts)  // Get current user's products
productRouter.get('/vendor/:vendorId', getProductsByVendor)  // Get products from any vendor (public)

export default productRouter