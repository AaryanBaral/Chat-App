import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getMychats, newGroupChat } from "../controllers/chatController.js";
const route = express.Router();


route.use(isAuthenticated); // authentication is made compulsory to access any of the folowing routes
route.post("/new", newGroupChat);
route.get("/my", getMychats);

export default route;
