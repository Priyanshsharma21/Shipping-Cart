import express from 'express'
import { register,login, getUserProfile,updateUser } from '../controllers/userController.js'
import AWS from 'aws-sdk'
import { auth, isLoggedIn } from '../middlewares/index.js'


const router = express.Router()


AWS.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})



router.get('/user/:userId/profile',isLoggedIn, getUserProfile)
router.post('/register', register)
router.post('/login', login)
router.put('/user/:userId/profile',isLoggedIn,auth, updateUser)



export default router