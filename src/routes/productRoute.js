import express from 'express'
import { getProductQuery,createProduct,getProductById,updateProduct,
deleteProduct } from '../controllers/productController.js'


const router = express.Router();



router.get('/products', getProductQuery)
router.post('/products', createProduct)
router.get('/products/:productId', getProductById)
router.put('/products/:productId', updateProduct)
router.delete('/products/:productId', deleteProduct)



export default router