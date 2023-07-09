import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import userRouter from './routes/userRoutes.js'
import productRoute from './routes/productRoute.js'
import cartRoute from './routes/cartRoute.js'
import orderRoute from './routes/orderRoute.js'
import multer from 'multer'



// global middleware
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(morgan("tiny"))
app.use(cors())



app.use(multer().any())




// testing route
app.get('/',(req,res)=>{
    res.status(200).json({status : true, message : "ZLIB IS RUNNING LIKE BOLT"})
})


// routing middleware
app.use('/',userRouter)
app.use('/',productRoute)
app.use('/',cartRoute)
app.use('/',orderRoute)




export default app