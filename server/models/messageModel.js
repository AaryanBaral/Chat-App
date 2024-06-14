import mongoose, { Schema,model } from "mongoose"

const messageSchema = new Schema({
    content: String,
    chat:{
        type: mongoose.Types.ObjectId,
        ref:"Chat"
    },
    sender:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    attachment:[
        {
            public_id:{
                type:String,
                required :true
            },
            url:{
                type :String,
                required:true
            }
        } 
            
    ]
},{
    timestamps:true
})

export const Message = mongoose.models.Message || model("Message",messageSchema);
