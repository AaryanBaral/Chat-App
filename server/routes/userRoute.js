import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
} from "../controllers/userController.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  acceptFriendRequestValidator,
  loginValidator,
  registerValidator,
  sendFriendRequestValidator,
  validatorHandler,
} from "../lib/validator.js";
const route = express.Router();

route.post("/login", loginValidator(), validatorHandler, login);
route.post(
  "/new",
  singleAvatar,
  registerValidator(),
  validatorHandler,
  newUser
);

route.use(isAuthenticated); // authentication is made compulsory to access any of the folowing routes
route.get("/me", getProfile);
route.post("/logout", logout);
route.get("/search", searchUser);
route.put(
  "/sendrequest",
  sendFriendRequestValidator(),
  validatorHandler,
  sendFriendRequest
);
route.put(
  "/acceptrequest",
  acceptFriendRequestValidator(),
  validatorHandler,
  acceptFriendRequest
);
route.get(
  "/getnotifications",
  getMyNotifications
);
route.get(
  "/myfriends",
  getMyFriends
);

export default route;
