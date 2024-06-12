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
import { Suspense, useState } from "react";
import { orange } from "../constants/color";
import { useNavigate } from "react-router-dom";
import { lazy } from "react";
import axios from "axios";
import { server } from "../../../../server/constants/configure";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";

const SearchDialog = lazy(() => import("../specific/Search"));
const Notification = lazy(() => import("../specific/Notification"));
const NewGroup = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const dispatch = useDispatch();
  const [isSearch, setIsSearch] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [isNotification, setIsNotification] = useState(false);

  const navigate = useNavigate();

  const handleMobile = () => {
    console.log("Mobile");
  };

  const toggleSearch = () => {
    setIsSearch((prev) => !prev);
  };

  const toggleNewGroup = () => {
    setIsNewGroup((prev) => !prev);
  };

  const toggleNotification = () => {
    setIsNotification((prev) => !prev);
  };

  const handleLogout = async () => {
    console.log("Logout");
    try {
      const {data} = await axios.get(`${server}/api/v1/user/logout`,{
        withCredentials:true
      })
      toast.success(data.message)
      dispatch(userNotExists())
    } catch (error) {
      toast.error(error?.response?.data?.message||"Something went wrong")
      console.log(error)
    }
  };

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
                display: { xs: "none", sm: "block" },
              }}
            >
              Wollo
            </Typography>
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconBtn title="" icon={<MenuIcon />} onClick={handleMobile} />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconBtn title="Search" icon={<SearchIcon />} onClick={toggleSearch} />
              <IconBtn title="New Group" icon={<AddIcon />} onClick={toggleNewGroup} />
              <IconBtn title="Manage Groups" icon={<GroupIcon />} onClick={navigateToGroup} />
              <IconBtn title="Notification" icon={<NotificationIcon />} onClick={toggleNotification} />
              <IconBtn title="Logout" icon={<LogoutIcon />} onClick={handleLogout} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroup />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <Notification />
        </Suspense>
      )}
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
