import {
  AppBar,
  Backdrop,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationIcon
} from "@mui/icons-material";
import React, { Suspense, useState } from "react";
import { orange } from "../constants/color";
import { useNavigate } from "react-router-dom";
import { lazy } from "react";
const SearchDialouge = lazy(()=> import ("../specific/Search"))
const Notification = lazy(()=> import ("../specific/Notification"))
const NewGroup = lazy(()=> import ("../specific/NewGroup"))

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const [isNewGroup, setIsNewGroup] = useState(false);

  const [isNotification, setIsNotification] = useState(false);

  const navigate = useNavigate();
  const handleMobile = () => {
    console.log("Mobile");
    setIsMobile((prev) => !prev)
  };
  const openSearch = () => {
    console.log("isSearch");
    setIsSearch((prev) => !prev)
  };
  const openNewGroup = () => {
   setIsNewGroup((prev) => !prev)
  };
  const openNotification=()=>{
    setIsNotification((prev) => !prev)
  }
  const loggedOutHandler = () => {};
  const navigateToGroup = () => {
    navigate("/groups");

  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar position="static" sx={{ bgcolor: orange }}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              Wollo
            </Typography>
            <Box
              sx={{
                display: {
                  xs: "block",
                  sm: "none",
                },
              }}
            >
              <IconBtn title=""
              icon={<MenuIcon/>}
              onClick={handleMobile}
              />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box>
              <IconBtn
                title="Search"
                icon={<SearchIcon />}
                onClick={openSearch}
              />

              <IconBtn
                title="New Group"
                icon={<AddIcon />}
                onClick={openNewGroup}
              />

              <IconBtn
                title="Manage Groups"
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />

              <IconBtn
                title="Notification"
                icon={<NotificationIcon />}
                onClick={openNotification}
              />
              <IconBtn
                title="Logout"
                icon={<LogoutIcon />}
                onClick={loggedOutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {
        isSearch && (
            <Suspense fallback={<Backdrop open />}>
                <SearchDialouge/>
            </Suspense>
        )
      }
      {
        isNewGroup && (
            <Suspense fallback={<Backdrop open />}>
                <NewGroup/>
            </Suspense>
        )
      }
      {
        isNotification && (
            <Suspense fallback={<Backdrop open />}>
                <Notification/>
            </Suspense>
        )
      }
    </>
  );
};

const IconBtn = ({ title, icon, onClick }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
