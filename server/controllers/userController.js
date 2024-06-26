import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { cookieOption, sendToken } from "../utils/cookie.js";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
import { Request } from "../models/requestModel.js";
import { emmitEvent, uploadFilesToCloudinary } from "../utils/feature.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password ,bio} = req.body;
  const file = req.file
  if(!file) return next(new ErrorHandler("Pleasae Upload Avatar",400))
  const result = await uploadFilesToCloudinary([file])
  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };
  const user = await User.create({
    name,
    username,
    password,
    bio,
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
  res.status(200).json({
    success: true,
    user: user,
  });
});
const logout = TryCatch(async (req, res, next) => {
  res
    .status(200)
    .cookie("wollo-token", "", { ...cookieOption, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
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
    success: true,
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
    success: true,
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
    await request.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }
  const members = [request.sender._id, request.receiver._id];
  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}- ${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);
  emmitEvent(req, REFETCH_CHATS, members);
  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});
const getMyNotifications = TryCatch(async (req, res, next) => {
  const requests = await Request.find({
    receiver: req.userId,
  }).populate("sender", "name avatar");
  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));
  res.status(200).json({
    success: true,
    allRequests,
  });
});

const getMyFriends = TryCatch(async (req, res, next) => { 
  const { chatId } = req.query;
  const chats = await Chat.find({
    members: req.userId,
    groupChat: false,
  }).populate("members", "name avatar");
  const friends = chats.map(({ members }) => {
    const othermember = getOtherMember(members, req.userId);
    return {
      _id: othermember._id,
      name: othermember.name,
      avatar: othermember.avatar.url,
    };
  });
  if(chatId){
    // this api is used by admin of the chat to see list of friends of the admin that are not present in a given chatId
    const chat = await Chat.findById(chatId)
    const availableFriend = friends.filter((friend)=>!chat.members.includes(friend._id))
    return res.status(200).json({
      success:true,
      availableFriend
    })
  }
  else{
    return res.status(200).json({
      success:true,
      friends
    })
  }
});
export {
  login,
  newUser,
  getProfile,
  logout,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends
};
