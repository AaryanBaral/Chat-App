import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMychats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachments,
} from "../controllers/chatController.js";
import { acttachmentsMulter } from "../middlewares/multer.js";
import {
  addMemberValidator,
  chatIdValidator,
  leaveGroupValidator,
  newGroupValidator,
  removeMemberValidator,
  renameGroupValidator,
  sendAttachmentsValidator,
  validatorHandler,
} from "../lib/validator.js";
const route = express.Router();

route.use(isAuthenticated); // authentication is made compulsory to access any of the folowing routes
route.post("/new", newGroupValidator(), validatorHandler, newGroupChat);
route.get("/my", getMychats);
route.get("/my/groups", getMyGroups);
route.put("/addmembers", addMemberValidator(), validatorHandler, addMembers);
route.put(
  "/removemember",
  removeMemberValidator(),
  validatorHandler,
  removeMember
);
route.delete("/leave/:id", leaveGroupValidator(), validatorHandler, leaveGroup);

// Send Attachments
route.post(
  "/message",
  acttachmentsMulter,
  sendAttachmentsValidator(),
  validatorHandler,
  sendAttachments
);

// Send Messages
route.get("/message/:id", chatIdValidator(), validatorHandler, getMessages);

// Get chat details,rename,delete
route
  .route("/:id")
  .get(chatIdValidator(), validatorHandler, getChatDetails)
  .put(renameGroupValidator(), validatorHandler,renameGroup)
  .delete(chatIdValidator(), validatorHandler, deleteChat);

export default route;
