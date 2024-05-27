import express from "express";
import { allChats, allMessages, allUsers, getDashboardStats } from "../controllers/adminController.js";



const route = express.Router();
route.get("/");
route.get("/verify");
route.get("/logout");
route.get("/users",allUsers);
route.get("/messages",allMessages);
route.get("/chats",allChats);
route.get("/stats",getDashboardStats);


export default route;
