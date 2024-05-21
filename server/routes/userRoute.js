import express from "express";
import {login,newUser} from "../controllers/userController.js"
import { singleAvatar} from "../middlewares/multer.js";

const route = express.Router()

route.get("/",login)
route.post("/new",singleAvatar,newUser)

export default route