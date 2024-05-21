import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import {Chat} from "../models/chatModel.js"
import { emmitEvent } from "../utils/feature.js";


const newGroupChat = TryCatch(
    async(req,res,next)=>{
        const{name,members} = req.body

        if(members.length<2) 
            return next(new ErrorHandler("Group chat must have atlease 3 members",400))

        const allMembers = [...members,req.user]
        await Chat.create({
            name,
            groupchat:true,
            creator:req.user,
            members:allMembers
        })
        emmitEvent(req,ALERT,allMembers,`Welcome to ${name} group`)
        emmitEvent(req,REFETCH_CHATS,members,`Welcome to ${name} group`)
        return res.status(201).json({
            sucess:true,
            message:"Group chat created"
        })
    }
)

export {newGroupChat}