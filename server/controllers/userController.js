import {User} from "../models/userModel.js"
import bcrypt from "bcrypt"
import { sendToken } from "../utils/cookie.js"
import { ErrorHandler, TryCatch } from "../middlewares/error.js"
const newUser = TryCatch(
    async(req,res)=>{
        const {name,username,password} = req.body
        const avatar = {
            public_id:"dafdadsf",
            url:"rafdsae"
        }
        const user = await User.create({
            name,
            username,
            password,
            avatar
        })
        sendToken(res,user,201,"User Created")
    }
)

const login = TryCatch(
    async (req,res,next)=>{
        const {username,password} = req.body;
        const user = await User.findOne({username}).select("+password")
        if(!user) return next(new ErrorHandler("Invalid Credentials",400))
        const isMatching = await bcrypt.compare(password,user.password)

        if( ! isMatching) return next(new ErrorHandler("Invalid Credentials",400))

        sendToken(res,user,201,`Wow welcome back, ${user.username}`)
    }
)
export {login,newUser}