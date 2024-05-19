import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { sampleUsers } from '../constants/SampleData'
import UserItem from '../shared/UserItem'
import { useInputValidation } from '6pp'
import { useState } from 'react'

const NewGroup = () => {
  const selectedMemberHandler =(id)=>{
    setSelectedMembers(
      (prev)=>prev.includes(id) ? 
      prev.filter((curr)=> curr !==id): 
      [...prev,id]
    )
  }
  const [members,setMembers] = useState(sampleUsers)
  const [selectedMembers,setSelectedMembers] = useState([]);
  const submitHandler = ()=>{}
  const groupName = useInputValidation();

  return ( 
<Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>
        <TextField label="Group Name " value={groupName.value} onChange={groupName.changeHandler}/>
        <Typography variant='body1'>Members</Typography>
        <Stack>
        {
          members.map((user)=>( 
           <UserItem
           user={user} 
           key={user._id}
           handler={selectedMemberHandler}
           isAdded={selectedMembers.includes(user._id)}
           />
          ))
        }
        </Stack>
        <Stack direction={"row"} justifyContent={"space-around"}>
          <Button variant="text" color='error' size='large'>Cancle</Button>
          <Button variant='contained' size='large' onClick={submitHandler}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup
