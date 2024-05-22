const getOtherMember = (members,userId)=>{
    return members.filter((member)=> member._id.toString()!== userId.toString())
}

export {getOtherMember}