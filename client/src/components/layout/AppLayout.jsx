/* eslint-disable react-hooks/rules-of-hooks */
import Header from './Header';
import Footer from './Footer';
import Title from '../shared/Title';
import { Grid, Skeleton } from '@mui/material';
import ChatList from '../specific/ChatList';
import { sampleChats } from '../constants/SampleData';
import Profile from '../specific/Profile';
import { useParams } from 'react-router-dom';
import { useMyChatsQuery } from '../../redux/api/api';

const AppLayout = ()=> (WrappedComponent) => {
  return (props) => {

    const { chatId } = useParams();
    const {isLoading,isError,error,refetch,data} = useMyChatsQuery("");
    console.log(data)
    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("delete chat", _id, groupChat);
    };

    return (
      <>
        <Title />
        <Header />
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{ display: { xs: "none", sm: "block" } }}
            height={"100%"}
          >
            {
              isLoading?(<Skeleton/>):(            <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
              />)
            }

          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            lg={6}
            height={"100%"}
          >
            <WrappedComponent {...props} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)"
            }}
          >
            <Profile />
          </Grid>
        </Grid>
        <Footer />
      </>
    );
  };
};

export default AppLayout;
