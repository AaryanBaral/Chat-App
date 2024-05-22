import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
import { emmitEvent } from "../utils/feature.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2)
    return next(
      new ErrorHandler("Group chat must have atlease 3 members", 400)
    );

  const allMembers = [...members, req.userId];
  await Chat.create({
    name,
    groupChat: true,
    creator: req.userId,
    members: allMembers,
  });
  emmitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emmitEvent(req, REFETCH_CHATS, members, `Welcome to ${name} group`);
  return res.status(201).json({
    sucess: true,
    message: "Group chat created",
  });
});
const getMychats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.userId }).populate(
    "members",
    "name avatar"
  );

  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMember(members, req.userId);
    return {
      _id,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : otherMember.avatar.url,
      name: groupChat ? name : otherMember.name,
      groupChat,
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.userId.toString()) {
          prev.push(req.userId);
        }
        return prev;
      }, []),
    };
  });
  return res.status(200).json({
    sucess: true,
    message: transformedChats,
  });
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    creator: req.userId,
    groupChat: true,
    members: req.userId,
  }).populate("members", "name avatar");
  console.log(chats);
  const groups = chats.map(({ _id, members, name, groupChat }) => {
    return {
      _id,
      groupChat,
      name,
      avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    };
  });
  return res.status(200).json({
    sucess: true,
    message: groups,
  });
});

export { newGroupChat, getMychats, getMyGroups };
