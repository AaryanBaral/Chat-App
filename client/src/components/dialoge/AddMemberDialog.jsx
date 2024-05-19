import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../constants/SampleData";
import UserItem from "../shared/UserItem";

const AddMemberDialog = ({ addMembers, isLoadingAddMember, chatId, styling={} }) => {
  const [members, setMembers] = useState (sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const selectedMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curr) => curr !== id) : [...prev, id]
    );
  };
  const addMemberSubmitHandler = () => {
    closeHandler();
  };
  const closeHandler = () => {
    setMembers([]);
    setSelectedMembers([])
  };
  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Members</DialogTitle>
        <Stack spacing={"1rem"}>
          {members.length > 0 ? (
            members.map((user) => (
              <UserItem key={user._id} user={user} handler={selectedMemberHandler} isAdded={selectedMembers.includes(user._id)} />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            variant="contained"
            disabled={isLoadingAddMember}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
