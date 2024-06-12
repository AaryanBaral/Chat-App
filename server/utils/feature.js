import {v2 as cloudinary} from "cloudinary";
import { v4 as uuid } from "uuid";
import { getBase64 } from "../lib/helper.js";
const emmitEvent = (req,event)=>{
    console.log("Emmiting event");
}
const deleteFilesFromCloudinary = async(public_id)=>{

}
const uploadFilesToCloudinary = async(files=[])=>{
    const uploadPromises = files.map((file)=>{
        return new Promise((resolve,reject)=>{
            cloudinary.uploader.upload(getBase64(file),{
                resource_type:"auto",
                public_id:uuid()
            },(error,result)=>{
                if(error) return reject(error);
                resolve(result)
            })
        })
    })
    try {
        const results = await Promise.all(uploadPromises)
        const formattedResult = results.map((result)=>({
            public_id:result.public_id,
            url : result.secure_url
        }))
        return formattedResult
    } catch (error) {
        console.log(error)
        throw new Error("Error while uploading to cloudinary",error)
    }

}
export{emmitEvent,deleteFilesFromCloudinary,uploadFilesToCloudinary}