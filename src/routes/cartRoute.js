import express from 'express'
import {
    getCart,
    postCart,
    updateCart,
    deleteCart
} from '../controllers/cartController.js'
import { auth, isLoggedIn } from '../middlewares/index.js'



const router = express.Router()


router.get('/users/:userId/cart',isLoggedIn,auth, getCart)
router.post('/users/:userId/cart',isLoggedIn,auth, postCart)
router.put('/users/:userId/cart',isLoggedIn,auth, updateCart)
router.delete('/users/:userId/cart',isLoggedIn,auth, deleteCart)


export default router