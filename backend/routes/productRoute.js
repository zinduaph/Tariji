import express from 'express'
import { addProduct, listProduct, uploadImages, updateProduct,deleteProduct, getVendorProducts, getProductsByVendor, getProductById } from '../controller/productController.js'
import authMiddleware from '../middleware/auth.js'

const productRouter = express.Router()

productRouter.post('/add',authMiddleware,uploadImages,addProduct)
productRouter.get('/list',listProduct)
productRouter.get('/my-products', authMiddleware, getVendorProducts)  // Get current user's products
productRouter.get('/vendor/:vendorId', getProductsByVendor)  // Get products from any vendor (public)
productRouter.get('/:productId', getProductById)
productRouter.post('/update/:productId', authMiddleware, updateProduct)
productRouter.post('/delete/:productId', authMiddleware, deleteProduct)
export default productRouter