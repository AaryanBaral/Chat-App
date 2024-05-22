import express from "express";
import {
  getProfile,
  login,
  logout,
  newUser,
  searchUser,
} from "../controllers/userController.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
const route = express.Router();

route.post("/login", login);
route.post("/new", singleAvatar, newUser);

route.use(isAuthenticated); // authentication is made compulsory to access any of the folowing routes
route.get("/me", getProfile);
route.post("/logout", logout);
route.get("/search", searchUser);

export default route;
