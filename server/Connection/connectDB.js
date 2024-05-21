import mongoose from "mongoose"

export const connectDB = async(uri)=>{
    try {
        await mongoose.connect(uri,{dbName:"Wollo"})
        console.log(`db connected sucessfully`);
    } catch (error) {
        console.log(error);
        throw error
    }
}