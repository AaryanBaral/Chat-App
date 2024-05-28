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

// import { createGroupChat, createMessageInAChat, createSingleChat } from "./seeders/seeds.js";
// import { createUser } from "./seeders/seeds.js"; only used to create fake data in the database



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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/admin", adminRoute);

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
