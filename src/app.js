import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import userRouter from './routes/userRoutes.js'
import productRoute from './routes/productRoute.js'
import multer from 'multer'




const app = express()

app.use(morgan("tiny"))
app.use(cors())



app.use(multer().any())




// testing route
app.get('/',(req,res)=>{
    res.status(200).json({status : true, message : "ZLIB IS RUNNING LIKE BOLT"})
})



// routing middlewares
app.use('/',userRouter)
app.use('/',productRoute)

export default app