/* eslint-disable react-hooks/rules-of-hooks */
import Header from "./Header";
import Footer from "./Footer";
import Title from "../shared/Title";
import { Drawer, Grid, Skeleton } from "@mui/material";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import { useParams } from "react-router-dom";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getSocket } from "../../socket";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../constants/events";
import { useCallback, useEffect } from "react";
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { getOrSaveFromLocalStorage } from "../../lib/features";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const { chatId } = useParams();
    const dispatch = useDispatch();
    const socket = getSocket()
    const { isLoading, isError, error, refetch, data } = useMyChatsQuery("");
    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);
    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("delete chat", _id, groupChat);
    };
    const handleMobileClose = () => {
      dispatch(setIsMobile(false));
    };
    const newMessageAlertHandler = useCallback((data)=>{
      if(data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data))
    },[chatId])
    const newRequestHandler = useCallback(()=>{
      dispatch(incrementNotification())
    },[])
    const eventHandler = { 
      [NEW_MESSAGE]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestHandler,

     };
    useSocketEvents(socket, eventHandler);
    useErrors([{isError,error}])
    useEffect(()=>{
      getOrSaveFromLocalStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert})
    },[newMessagesAlert])


    return (
      <>
        <Title />
        <Header />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
            w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
            />
          </Drawer>
        )}
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{ display: { xs: "none", sm: "block" } }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}

              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user}/>
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user = {user} />
          </Grid>
        </Grid>
        <Footer />
      </>
    );
  };
};

export default AppLayout;
