const getOtherMember = (members,userId)=>{
    return members.find((member)=> member._id.toString()!== userId.toString())
}

const getSockets = (users = [])=>{
    return users.map((user)=>userSocketIDs.get(user._id.toString()))
}

const getBase64 = (file)=>{
    return `data:${file.memetype};base64,${file.buffer.toString("base64")}`
}
export {getOtherMember,getSockets,getBase64}