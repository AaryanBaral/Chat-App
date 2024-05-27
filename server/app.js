import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./connection/connectDB.js";
import { errorMiddleWare } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import adminRoute from "./routes/adminRoute.js";

// import { createGroupChat, createMessageInAChat, createSingleChat } from "./seeders/seeds.js";
// import { createUser } from "./seeders/seeds.js"; only used to create fake data in the database

dotenv.config({
  path: "./.env",
});
const app = express();
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

app.use(errorMiddleWare);
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
