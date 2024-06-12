import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import express from "express";
import { connectDB } from "./connection/connectDB.js";
import { errorMiddleWare } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import adminRoute from "./routes/adminRoute.js";
import {Server} from "socket.io"
import {createServer, get} from "http"
import { NEW_ATTACHMENTS, NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import {v4 as uuid} from "uuid"
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/messageModel.js";
import {v2 as cloudnary} from "cloudinary"
import cors from "cors"

import { createGroupChat, createMessageInAChat, createSingleChat,createMessage } from "./seeders/seeds.js";
import { createUser } from "./seeders/seeds.js"; // only used to create fake data in the database



const user = {
  _id:"asdfasdfa",
  name:"sdfasdfas"
}

export const adminSceretKey =
process.env.ADMIN_SCERET_KEY || "WolloAdmin Aaryan Baral";
const app = express();
const server = createServer(app)
const io = new Server(server,{

})

const userSocketIds = new Map()
const PORT = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI);
cloudnary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
})
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:["http://localhost:5173","http://localhost:4173",process.env.CURRENT_URL],
  credentials:true
}))
// createMessage(100)
// createGroupChat(50)
// createMessageInAChat("6669c4e9dd3896a50d1708d8",50)
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("hellow world");
});

io.on("connect",socket=>{
  userSocketIds.set(user._id.toString(),socket.id)
  console.log("a user connected", socket.id)

  console.log(userSocketIds)
  socket.on(NEW_MESSAGE,async ({chatId,message,members})=>{
    const messageForRealTime={
      content:message,
      id:uuid(),
      sender:{
        _id:user._id,
        name:user.name
      },
      chat:chatId,
      createdAt:new Date().toISOString()
    }
    const messageForDB = {
      content:message,
      sender:user._id,
      chat:chatId
    }
    const usersSocket= getSockets(members)
    io.to(usersSocket).emit(NEW_MESSAGE,{
      chatId,
      message:messageForRealTime
    })

    io.to(usersSocket).emit(NEW_MESSAGE_ALERT,{chatId})
    try {
      await Message.create(messageForDB);
    } catch (err) {
      console.log(err);
    }
  })
  socket.on("disconnect",()=>{
    userSocketIds.delete(user._id.toString())
    console.log("User Disconnected")
  })
})


app.use(errorMiddleWare);
server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
