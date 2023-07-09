import express from 'express'
import {
    createOrder,
    updateOrder
} from '../controllers/orderController.js'
import { auth, isLoggedIn } from '../middlewares/index.js'



const router = express.Router()

router.post('/users/:userId/orders',isLoggedIn,auth, createOrder)
router.put('/users/:userId/orders',isLoggedIn,auth, updateOrder)


export default router