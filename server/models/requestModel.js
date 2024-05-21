import mongoose, { Schema,model, models } from "mongoose"

const requestSchema = new Schema({
    status: {
        type:String,
        default:"pending",
        enum:['pending','accepeted','rejected']
    },
    sender:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
},{
    timestamps:true
})

export const Request = mongoose.models.Request || model("Request",requestSchema);
