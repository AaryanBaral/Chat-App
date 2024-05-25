import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { cookieOption, sendToken } from "../utils/cookie.js";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password)
    return next(
      new ErrorHandler("please provide all the required fields", 400)
    );
  const avatar = {
    public_id: "dafdadsf",
    url: "rafdsae",
  };
  const user = await User.create({
    name,
    username,
    password,
    avatar,
  });
  sendToken(res, user, 201, "User Created");
});

const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid Credentials", 400));
  const isMatching = await bcrypt.compare(password, user.password);

  if (!isMatching) return next(new ErrorHandler("Invalid Credentials", 400));

  sendToken(res, user, 201, `Wow welcome back, ${user.username}`);
});

const getProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.userId);
  console.log(user);
  res.status(200).json({
    sucess: true,
    user: "user",
  });
});

const logout = TryCatch(async (req, res, next) => {
  res
    .status(200)
    .cookie("wollo-token", "", { ...cookieOption, maxAge: 0 })
    .json({
      sucess: true,
      message: "Logged out sucessfully",
    });
});
const searchUser = TryCatch(async (req, res, next) => {
  const { name="" } = req.query;
  const chats = await Chat.find({
    groupChat: false,
    members: req.userId,
  }).populate();
  const allUsersFromMyChat = chats.flatMap((chat) => chat.members);
  const allUserExceptMeAndMyFriends = await User.find({
    _id: { $nin: allUsersFromMyChat },
    name: { $regex: name, $options: "i" },
  });
   const users = allUserExceptMeAndMyFriends.map(({_id,name,avatar})=>({
    _id,
    name,
    avatar:avatar.url
   }))
  res.status(200).json({
    sucess: true,
    users,
  });
});
export { login, newUser, getProfile, logout, searchUser };
