/* eslint-disable react-refresh/only-export-components */
import { Fragment, useCallback, useState } from "react";
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

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const socket = getSocket();
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);


  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessageChunk = useGetMessagesQuery({ chatId, page });

  const submitHandler = (e) => {
    const members = chatDetails?.data?.chat?.members;
    e.preventDefault();
    if (!message.trim()) return;
    //Emitting message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };



  const newMessagesHandler = useCallback((data) => {
    setMessages((prev) => [...prev, data.message]);
  }, []);

  const eventHandler = { [NEW_MESSAGE]: newMessagesHandler };
 console.log(oldMessageChunk.data)
  useSocketEvents(socket, eventHandler);

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { oldMessageChunk: oldMessageChunk.isError, error: oldMessageChunk.error },
  ];
  useErrors(errors);

  return (chatDetails.isLoading) ? (
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
        {!oldMessageChunk.isLoading && oldMessageChunk?.data?.messages?.map((i) => (
          <MessageComponent message={i} user={user} key={i.id} />
        ))}
        {messages.map((i) => (
          <MessageComponent message={i} user={user} key={i.id} />
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
      <FileMenu />
    </Fragment>
  );
};

export default AppLayout()(Chat);
