import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import {useInputValidation} from "6pp"
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from '../shared/UserItem';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery } from '../../redux/api/api';

const Search = () => {
  const search = useInputValidation("");
  const [users,setUsers ] = useState([])
  const dispatch = useDispatch()
  let isLoadingSendFriendRequest = false
  const {isSearch} = useSelector(state=>state.misc)
  const [searchUser] = useLazySearchUserQuery()
  const addFriendHandler = ()=>{

  }  
  const closeSearch = ()=>{
    dispatch(setIsSearch(false));
  }

  useEffect(()=>{
    const timeOutId= setTimeout(()=>{
      searchUser(search.value).then(({data})=> setUsers(data.users))
      .catch((err)=>console.log(err))
    },500)
    return ()=>{
      clearTimeout(timeOutId)
    }
  },[search.value])
  return (
  <Dialog open={isSearch} onClose={closeSearch}>
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
