const getOtherMember = (members,userId)=>{
    return members.find((member)=> member._id.toString()!== userId.toString())
}

const getSockets = (users = [])=>{
    return users.map((user)=>userSocketIDs.get(user._id.toString()))
}
export {getOtherMember,getSockets}