import express from "express";
import { allUsers } from "../controllers/adminController.js";



const route = express.Router();
route.get("/");
route.get("/verify");
route.get("/logout");
route.get("/users",allUsers);
route.get("/messages");
route.get("/chats");
route.get("/stats");


export default route;
