import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addMembers,
  deleteChatDetails,
  getChatDetails,
  getMychats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachments,
} from "../controllers/chatController.js";
import { acttachmentsMulter } from "../middlewares/multer.js";
const route = express.Router();

route.use(isAuthenticated); // authentication is made compulsory to access any of the folowing routes
route.post("/new", newGroupChat);
route.get("/my", getMychats);
route.get("/my/groups", getMyGroups);
route.put("/addmembers", addMembers);
route.put("/removemember", removeMember);
route.delete("/leave/:id",leaveGroup)

// Send Attachments

route.post("/message",acttachmentsMulter,sendAttachments)
// Send Messages

route.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChatDetails)
// Get chat details,rename,delete

export default route;
