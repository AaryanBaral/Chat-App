import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import { 
    Face as FaceIcon,
    AlternateEmail as UserNameIcon,
    CalendarMonth as CalendarIcon
 } from "@mui/icons-material";
import moment from "moment"
const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard text={"asdad lajksdfjash"} heading={"bio"} />
      <ProfileCard text={"anonymous"} heading={"usermane"} Icon={<UserNameIcon/>}/>
      <ProfileCard text={"Aaryan Baral"} heading={"Name"} Icon={<FaceIcon/>} />
      <ProfileCard text={moment('2023-11-04T18:30:00.000Z').fromNow()} heading={"Joined"} Icon={<CalendarIcon/>} />
    </Stack>
  ); 
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}
    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography color={"gray"} varient="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
