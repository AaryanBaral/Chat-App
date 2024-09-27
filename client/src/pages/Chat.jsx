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
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessageAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loader";

const Chat = ({ chatId, user }) => {
  let oldMessageChunk;
  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [IamTyping,setIamTyping] = useState(false)
  const [userTyping,setUserTyping] = useState(false);
  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);
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
    socket.emit(STOP_TYPING,{members,chatId })
    setIamTyping(false);
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };
  const handleFile = async(e)=>{
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget)
  }
  const members = chatDetails?.data?.chat?.members;
  const mesageOnChange = (e)=>{
    setMessage(e.target.value)
    if(!IamTyping){
      socket.emit(START_TYPING,{members,chatId})
      setIamTyping(true);
    }
    if(typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current =  setTimeout(()=>{
      socket.emit(STOP_TYPING,{members,chatId })
      setIamTyping(false);
    },[2000])
    socket.emit(START_TYPING,{members,chatId})

  }

  const newMessagesListner = useCallback((data) => {
    if(data.chatId!== chatId) return ;
    setMessages((prev) => [...prev, data.message]);
  }, [chatId]);

  const startTypingListner = useCallback((data) => {
    if(data.chatId!== chatId) return ;
    setUserTyping(true)
  }, [chatId]);

  const stopTypingListner = useCallback((content) => {
    const messageForAlert = {
      content,
      sender:{
        _id:"asdadadad",
        name:"Admin"
      },
      chat:chatId,
      createdAt:new Date().toISOString(),
    }
    setMessages((prev)=> [...prev,messageForAlert])
  }, [chatId]);


  const newAlertListner = useCallback((content) => {

    const setMessageForAlert = {
      content,
      sender:{
        _id:"faiuhfasdfasd",
        name:"Admin"
      },
      chat:chatId,
      createdAt:new Date().toISOString(),
    }
    setMessages((prev)=> [...prev,setMessageForAlert]);
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
  useEffect(()=>{
    if(bottomRef.current) bottomRef.current.scrollIntoView({
      behavior:"smooth"
    })
  },[messages])


  const eventHandler = { 
    [ALERT]: newAlertListner,
    [NEW_MESSAGE]: newMessagesListner,
    [START_TYPING]: startTypingListner,
    [STOP_TYPING]: stopTypingListner,
   };
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
        {userTyping && <TypingLoader />}
        <div ref={bottomRef}/>
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
            onChange={mesageOnChange}
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
