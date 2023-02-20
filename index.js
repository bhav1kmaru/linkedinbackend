const express=require('express')
const cors=require('cors')
const { connection } = require('./config/db')
const { userRouter } = require('./routes/User.Routes')
const { postRouter } = require('./routes/Posts.Routes')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Home Page")
})

app.use('/users',userRouter)
app.use('/posts',postRouter)



const port=process.env.port
app.listen(port,async()=>{
    console.log(`server running on port ${port}`)
    try {
        await connection
        console.log('connected to database')

    } catch (error) {
        console.log('could not connect to database')
        console.log(error.message)
    }
})
