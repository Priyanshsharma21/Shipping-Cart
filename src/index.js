import app from './app.js'
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'


dotenv.config()

const { PORT, MONGODB_URL } = process.env


const startServer = async()=>{
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("DB Connected")
        app.listen(PORT, ()=>{
            console.log(`Running Up The Hill At ${PORT}km/hr`)
        })
    } catch (error) {
        console.log(error)
    }
}
startServer()