import { Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material'
import React from 'react'
import {useInputValidation} from "6pp"
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from '../shared/UserItem';
import { useState } from 'react';
import { sampleUsers } from '../constants/SampleData';

const Search = () => {
  const search = useInputValidation("");
  const [users,setUsers] = useState(sampleUsers)
  let isLoadingSendFriendRequest = false
  const addFriendHandler = ()=>{

  }  
  return (
  <Dialog open>
    <Stack p={"2rem"} direction={"column"} width={"25rem"}>
      <DialogTitle  textAlign={"center"}>Find People</DialogTitle>
      <TextField label="" value={search.value} onChange={search.changeHandler}
      variant='outlined'
      size='small'
      InputProps={{
        startAdornment:(
          <InputAdornment position='start'>
          <SearchIcon />
          </InputAdornment>
        )
      }}
      />


      <List>
        {
          users.map((user)=>(
           <UserItem
           user={user} 
           key={user._id}
           handler={addFriendHandler}
           handlerIsLoading={isLoadingSendFriendRequest}
           />
          ))
        }
      </List>
    </Stack>
  </Dialog>
  )
}

export default Search
