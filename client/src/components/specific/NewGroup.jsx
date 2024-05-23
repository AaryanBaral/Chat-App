import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { sampleUsers } from '../constants/SampleData';
import { useInputValidation } from '6pp';
import UserItem from '../shared/UserItem';

const NewGroup = () => {
  const selectedMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((curr) => curr !== id)
        : [...prev, id]
    );
  };

  const [members] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const submitHandler = () => {};
  const groupName = useInputValidation();

  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">New Group</DialogTitle>
        <TextField label="Group Name:" value={groupName.value} onChange={groupName.changeHandler} />
        <Typography variant="body1">Members</Typography>
        <Stack>
          {members.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={selectedMemberHandler}
              isAdded={selectedMembers.includes(user._id)}
            />
          ))}
        </Stack>
        <Stack direction="row" justifyContent="space-around">
          <Button variant="text" color="error" size="large">Cancel</Button>
          <Button variant="contained" size="large" onClick={submitHandler}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
