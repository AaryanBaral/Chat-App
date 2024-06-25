/* eslint-disable react-refresh/only-export-components */
import { Fragment, useCallback, useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { useRef } from "react";
import { grayColor, orange } from "../constants/color";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/Styles/StyleComponent";
import FileMenu from "../components/dialoge/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import { NEW_MESSAGE } from "../constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessageAlert } from "../redux/reducers/chat";

const Chat = ({ chatId, user }) => {
  let oldMessageChunk;
  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  oldMessageChunk = useGetMessagesQuery({ chatId, page });

  const {data:oldMessages,setData:setOldMessages} = useInfiniteScrollTop(
    containerRef,
    oldMessageChunk.data?.totalPages,
    page,
    setPage,
    oldMessageChunk.data?.messages
    );
  const allMessages = [...oldMessages,...messages];

  const submitHandler = (e) => {
    const members = chatDetails?.data?.chat?.members;
    e.preventDefault();
    if (!message.trim()) return;
    //Emitting message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };
  const handleFile = async(e)=>{
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget)
  }

  const newMessagesHandler = useCallback((data) => {
    if(data.chatId!== chatId) return ;
    setMessages((prev) => [...prev, data.message]);
  }, [chatId]);
  useEffect(()=>{
    dispatch(removeNewMessageAlert(chatId))
    return ()=>{
     setMessage("");
     setMessages([]);
     setPage(1)
     setOldMessages([])
    }
  },[chatId])

  const eventHandler = { [NEW_MESSAGE]: newMessagesHandler };
  useSocketEvents(socket, eventHandler);

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { oldMessageChunk: oldMessageChunk.isError, error: oldMessageChunk.error },
  ];
  useErrors(errors);


  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent message={i} user={user} key={i._id} />
        ))}
      </Stack>
      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          height={"100%"}
          padding={"1rem"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "45deg",
            }}
            onClick={handleFile}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder='"Enter your message here....'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            type="submit"
            sx={{
              rotate: "-45deg",
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              textAlign: "center",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>
    </Fragment>
  );
};

export default AppLayout()(Chat);
