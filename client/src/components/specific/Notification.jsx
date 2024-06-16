/* eslint-disable no-unused-vars */
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const Notification = () => {
  const { isLoading, data, error, isError } = useGetNotificationQuery();
  const dispatch = useDispatch()
  const {isNotification} = useSelector(state=>state.misc)
  const [acceptrequest] = useAcceptFriendRequestMutation()
  const friendRequestHandler = async({ _id, accept }) => {
    dispatch(setIsNotification(false))
    try {

      const res = await acceptrequest({requestId:_id ,accept});
      if(res?.data?.success){
        console.log("User Socket Here");
        toast.success(res?.data?.message)
      }
      else toast.error(res?.data?.error || "something went wrong")
    } catch (error) {
      toast.error(error?.message || "something went wrong")
    }
  };

  const closeNotification = ()=>{
    dispatch(setIsNotification(false))
  }

  useErrors([{ error, isError }]);
  return (
    <Dialog open={isNotification} onClose={closeNotification}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxwidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? (
          <Skeleton></Skeleton>
        ) : (
          <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests?.map((i) => (
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
          </>
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
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button
            color={"error"}
            onClick={() => handler({ _id, accept: false })}
          >
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notification;
