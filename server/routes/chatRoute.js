import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { newGroupChat } from "../controllers/chatController.js";
const route = express.Router();


route.use(isAuthenticated); // authentication is made compulsory to access any of the folowing routes
route.post("/new", newGroupChat);

export default route;
