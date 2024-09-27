import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useInputValidation } from '6pp';
import UserItem from '../shared/UserItem';
import { useDispatch, useSelector } from 'react-redux';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { useAsyncMutuation, useErrors } from '../../hooks/hook';
import { setIsNewGroup } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';

const NewGroup = () => {
  const {isNewGroup} = useSelector((state)=>state.misc);
  const dispatch = useDispatch();
  const [newGroup, isLoadingNewGroup] = useAsyncMutuation(useNewGroupMutation)
  const {isError,isLoading, data, error} = useAvailableFriendsQuery();
  console.log(data);
  const errors = [{
    isError,
    error
  }]
  const selectedMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((curr) => curr !== id)
        : [...prev, id]
    );
  };
  const closeHandler = ()=>{
    dispatch(setIsNewGroup(false))
  }

  const [selectedMembers, setSelectedMembers] = useState([]);
  const submitHandler = () => {
    if(!groupName.value) return toast.error("Group Name is Required");
    if(selectedMembers.length <2) return toast.error("Please select atleast 3 members");

    console.log(groupName.value, selectedMembers)
    newGroup("Creating New Group....",{name:groupName.value, members:selectedMembers});
    closeHandler();
  };
  const groupName = useInputValidation();
  useErrors(errors)

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">New Group</DialogTitle>
        <TextField label="Group Name:" value={groupName.value} onChange={groupName.changeHandler} />
        <Typography variant="body1">Members</Typography>
        <Stack>
          { isLoading ?< Skeleton/>: data?.friends?.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={selectedMemberHandler}
              isAdded={selectedMembers.includes(user._id)}
            />
          ))}
        </Stack>
        <Stack direction="row" justifyContent="space-around">
          <Button variant="text" color="error" size="large" onClick={closeHandler}>Cancel</Button>
          <Button variant="contained" size="large" onClick={submitHandler}>Create</Button>
        </Stack>
      </Stack >
    </Dialog>
  );
};

export default NewGroup;
