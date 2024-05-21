/* eslint-disable react-refresh/only-export-components */
import { Fragment } from 'react'
import AppLayout from '../components/layout/AppLayout';
import { IconButton, Stack } from '@mui/material';
import { useRef } from 'react';
import { grayColor, orange } from '../components/constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/Styles/StyleComponent';
import FileMenu from '../components/dialoge/FileMenu';
import { sampleMessage } from '../components/constants/SampleData';
import MessageComponent from '../components/shared/MessageComponent';

const Chat = () => {

  const user = {
    _id:"sfsfsdfsfsdfsdfs",
    name:"Aaryan Baral"
  }
  const containerRef = useRef(null);
  return (
    <Fragment>
      <Stack ref={containerRef}
      boxSizing={'border-box'}
      padding={"1rem"}
      spacing={"1rem"}
      bgcolor={grayColor}
      height={"90%"}
      sx={{
        overflowX:"hidden",
        overflowY:"auto",

      }}
      
      >
        {
          sampleMessage.map((i)=>(
            <MessageComponent message={i} user={user} key={i.id}/>
          ))
        }
      </Stack>
      <form style={{
        height:"10%",
      }}>
        <Stack 
        direction={"row"}
        alignItems={"center"}
        height={"100%"}
        padding={"1rem"}
        position={"relative"}

        >
          <IconButton
           sx={{
            position:"absolute",
            left:"1.5rem",
            rotate:"45deg"
          }}>
            <AttachFileIcon />
          </IconButton>
          <InputBox />
          <IconButton type='submit' sx={{
            rotate:"-45deg",
            bgcolor: orange,
            color: "white",
            marginLeft: "1rem",
            padding: "0.5rem",
            textAlign:"center",
            "&:hover":{
              bgcolor:"error.dark"
            }

          }}>
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu />
    </Fragment>
  )
}

export default AppLayout()(Chat);
