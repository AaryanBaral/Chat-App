import mongoose, { Schema,model, models } from "mongoose"

const chatSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    groupChat:{
        type: Boolean,
        default:false
    },
    creator:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    members:[
        {
            type :mongoose.Types.ObjectId,
            ref:"User"
        }
    ]
},{
    timestamps:true
})

export const Chat = mongoose.models.Chat || model("Chat",chatSchema);
