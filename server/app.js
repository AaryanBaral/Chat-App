import dotenv from "dotenv"
import express from "express"
import userRoute from "./routes/userRoute.js"
import { connectDB } from "./Connection/connectDB.js"
import { errorMiddleWare } from "./middlewares/error.js"

dotenv.config({
    path:"./.env"
})
const app  = express()
const PORT = process.env.PORT || 3000
connectDB(process.env.MONGO_URI)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
 
app.use("/user",userRoute)

app.get("/",(req,res)=>{
    res.send("hellow world")
})


app.use(errorMiddleWare)
app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
})