import jwt from "jsonwebtoken";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { cookieOption } from "../utils/cookie.js";
import { adminSceretKey } from "../app.js";

const adminLogin = TryCatch(async (req, res, next) => {
  const { sceretKey } = req.body;

  const isMatch = sceretKey === adminSceretKey;
  if (!isMatch) return next(new ErrorHandler("Invalid Admin Key", 401));
  const token = jwt.sign(sceretKey, process.env.JWT_SCECRET);
  return res
    .status(200)
    .cookie("wollo-admin", token, { ...cookieOption, maxAge: 10000 * 60 * 45 })
    .json({
      success: true,
      message: "Authenticated successfully, Welcome Admin",
    });
});
const adminLogout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("wollo-admin", "", { ...cookieOption, maxAge: 0 })
    .json({
      success: true,
      message: "Logged Out successfully, See You Soon Admin",
    });
});

const getAdminData = TryCatch(async(req,res,next)=>{
  res.status(200).json({
    admin:true
  })
})

const allUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  const transformedUsers = await Promise.all(
    users.map(async ({ name, avatar, username, _id }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ group: true, members: _id }),
        Chat.countDocuments({ group: false, members: _id }),
      ]);
      return {
        name,
        username,
        avatar: avatar.url,
        groups,
        friends,
      };
    })
  );
  res.status(200).json({
    success: true,
    users: transformedUsers,
  });
});

const allChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformedChats = await Promise.all(
    chats.map(async ({ members, groupChat, _id, name, creator }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });
      return {
        _id,
        name,
        groupChat,
        creator,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
        members: members.map(({ name, _id, avatar }) => ({
          _id,
          name,
          avatar: avatar.url,
        })),
        creator: {
          _id: creator?._id || "none",
          avatar: creator?.avatar.url || "",
        },
        totalMembers: members.length,
        totalMessages,
      };
    })
  );
  res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});
const allMessages = TryCatch(async (req, res, next) => {
  const messages = await Message.find({})
    .populate("chat", "groupChat")
    .populate("sender", "name avatar");
  const transformedMessages = messages.map(
    ({ content, attchments, _id, sender, createdAt, chat }) => ({
      content,
      _id,
      attchments,
      createdAt,
      chat: chat._id,
      groupChat: chat.groupChat,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    })
  );

  res.status(200).json({
    success: true,
    messages: transformedMessages,
  });
});
const getDashboardStats = TryCatch(async (req, res, next) => {
  const [groupsCount, messagesCount, usersCount, totalChatsCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      Message.countDocuments(),
      User.countDocuments(),
      Chat.countDocuments(),
    ]);
  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const last7DaysMessages = await Message.find({
    createdAt: {
      $gte: last7Days,
      $lte: today,
    },
  }).select("createdAt");
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  const messages = new Array(7).fill(0);
  last7DaysMessages.forEach((message) => {
    const indexApprox =
      (today.getTime() - message.createdAt.getTime()) / dayInMilliseconds;
    const index = Math.floor(indexApprox);
    messages[6 - index]++;
  });
  const stats = {
    groupsCount,
    messagesCount,
    usersCount,
    totalChatsCount,
    messagesChart: messages,
  };
  res.status(200).json({
    success: true,
    stats,
  });
});
export { allUsers, allChats, allMessages, getDashboardStats, adminLogin,adminLogout,getAdminData };
