import express from "express";
import { adminLogin, adminLogout, allChats, allMessages, allUsers, getAdminData, getDashboardStats } from "../controllers/adminController.js";
import { adminLoginValidator, validatorHandler } from "../lib/validator.js";
import { isAuthenticatedAsAdmin } from "../middlewares/auth.js";



const route = express.Router();
route.post("/verify",adminLoginValidator(),validatorHandler, adminLogin);
route.post("/logout",adminLogout);
route.use(isAuthenticatedAsAdmin)
route.get("/",getAdminData);
route.get("/users",allUsers);
route.get("/messages",allMessages);
route.get("/chats",allChats);
route.get("/stats",getDashboardStats);


export default route;
