import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { cookieOption, sendToken } from "../utils/cookie.js";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
import { Request } from "../models/requestModel.js";
import { emmitEvent } from "../utils/feature.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
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
  const { name = "" } = req.query;
  const chats = await Chat.find({
    groupChat: false,
    members: req.userId,
  }).populate();
  const allUsersFromMyChat = chats.flatMap((chat) => chat.members);
  const allUserExceptMeAndMyFriends = await User.find({
    _id: { $nin: allUsersFromMyChat },
    name: { $regex: name, $options: "i" },
  });
  const users = allUserExceptMeAndMyFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));
  res.status(200).json({
    sucess: true,
    users,
  });
});
const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;
  const request = await Request.findOne({
    $or: [
      { sender: userId, receiver: req.userId },
      { sender: req.userId, receiver: userId },
    ],
  });
  if (request)
    return next(new ErrorHandler("Friend Request Already Sent", 400));
  await Request.create({
    sender: req.userId,
    receiver: userId,
  });
  emmitEvent(req, NEW_REQUEST, [userId]);
  res.status(200).json({
    sucess: true,
    message: "Friend Request Sent",
  });
});
const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;
  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request Not Found", 400));
  if (request.receiver._id.toString() !== req.userId.toString())
    return next(
      new ErrorHandler("You are not allowed to accept this request", 400)
    );
  if (!accept) {
    await request.deleteOne()
    return res.status(200).json({
      sucess: true,
      message: "Friend Request Sent",
    });
  }
  const members = [request.sender._id,request.receiver._id]
  await Promise.all([Chat.create({
    members,
    name:`${request.sender.name}- ${request.receiver.name}`
  }),request.deleteOne()])
  emmitEvent(req, REFETCH_CHATS, members);
  return res.status(200).json({
    sucess: true,
    message: "Friend Request Accepted",
    senderId:request.sender._id
  });
});
const getMyNotifications = TryCatch(async(req,res,next)=>{
  const requests = await Request.find({
    receiver:req.userId
  }).populate("sender","name avatar")
  const allRequests = requests.map(({_id,sender})=>({
    _id,
    sender:{
      _id:sender._id,
      name:sender.name,
      avatar:sender.avatar.url
    }
  }))
  res.status(200).json({
    sucess:true,
    allRequests
  })
})
export {
  login,
  newUser,
  getProfile,
  logout,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications
};
