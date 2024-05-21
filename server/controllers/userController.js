import {User} from "../models/userModel.js"
const newUser = async(req,res)=>{
    try{
        const {name,username,password} = req.body
        const avatar = {
            public_id:"dafdadsf",
            url:"rafdsae"
        }
        await User.create({
            name,
            username,
            password,
            avatar
        })
        res.status(201).json({message:"User created sucessfully"})
    }catch(err){
        res.status(401).json({message:`Error while creating user:  ${err}`})
    }
}

const login = (req,res)=>{
    res.send("user Login")
}
export {login,newUser}