/* eslint-disable no-unused-vars */
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { sampleNotification } from "../constants/SampleData";

const Notification = () => {
  const friendRequestHandler = ({ _id, accept }) => {};

  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxwidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {sampleNotification.length > 0 ? (
          sampleNotification.map((i) => (
            <NotificationItems
              key={i._id}
              sender={i.sender}
              _id={i._id}
              handler={friendRequestHandler}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>0 Notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItems = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipse",
            width: "100%",
          }}
        >
          {`${name} sent you a friend request`}
        </Typography>
        <Stack direction={{
          xs:"column",
          sm:"row"
        }}>
          <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
          <Button color={"error"} onClick={()=>handler({_id,accept:false})}>Reject</Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notification;
