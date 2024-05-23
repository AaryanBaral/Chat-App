import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addMembers,
  getMychats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
} from "../controllers/chatController.js";
const route = express.Router();

route.use(isAuthenticated); // authentication is made compulsory to access any of the folowing routes
route.post("/new", newGroupChat);
route.get("/my", getMychats);
route.get("/my/groups", getMyGroups);
route.put("/addmembers", addMembers);
route.put("/removemember", removeMember);
route.delete("/leave/:id",leaveGroup)

// Send Attachments

// Send Messages

// Get chat details,rename,delete

export default route;
