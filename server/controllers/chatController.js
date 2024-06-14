import {
  ALERT,
  NEW_ATTACHMENTS,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import { deleteFilesFromCloudinary, emmitEvent } from "../utils/feature.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

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
    chats: transformedChats,
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

const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;
  if (!members || members.length < 1)
    return next(new ErrorHandler("Please provide members", 400));
  const chats = await Chat.findById(chatId);
  if (!chats) return next(new ErrorHandler("Chat not Found", 404));
  if (!chats.groupChat)
    return next(new ErrorHandler("Chat is not a group chat", 400));
  if (chats.creator.toString() !== req.userId.toString())
    return next(ErrorHandler("Only admin can add members", 403));
  const allMembersPromise = members.map((memberId) =>
    User.findById(memberId, "name")
  );
  const allMembers = await Promise.all(allMembersPromise);
  const uniqueMembers = allMembers
    .filter((member) => !chats.members.includes(member._id.toString()))
    .map((member) => member._id);
  chats.members.push(...uniqueMembers.map((member) => member._id));
  if (chats.members.length > 100)
    return next(new ErrorHandler("Group members limit reached", 400));
  await chats.save();
  const allMemberNames = uniqueMembers.map((member) => member.name).join(",");
  emmitEvent(
    req,
    ALERT,
    chats.members,
    `${allMemberNames} have been added in the group`
  );
  emmitEvent(req, REFETCH_CHATS, chats.members);
  return res.status(200).json({
    sucess: true,
    mesage: "Members added sucesssfully ",
  });
});

const removeMember = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;
  console.log(chatId, userId);
  const [chat, userToBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);
  if (!userToBeRemoved) return next(new ErrorHandler("User not found", 400));
  if (!chat) return next(new ErrorHandler("Chat not Found", 404));
  if (!chat.groupChat)
    return next(new ErrorHandler("Chat is not a group chat", 400));
  if (chat.creator.toString() !== req.userId)
    return next(new Error("Only the admin can remove members", 403));
  if (chat.members.length <= 3) {
    return next(
      new ErrorHandler(
        "Cannot remove members a group must have atleast 3 members"
      )
    );
  }
  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );
  chat.save();
  emmitEvent(
    req,
    ALERT,
    chat.members,
    `${userToBeRemoved.name} has been removed from the group`
  );
  emmitEvent(req, REFETCH_CHATS, chat.members);
  return res.status(200).json({
    sucess: true,
    mesage: "Member removed sucesssfully ",
  });
});

const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not Found", 404));
  if (!chat.members.includes(req.userId))
    return next(new ErrorHandler("You do not exist in this group", 400));
  if (!chat.groupChat)
    return next(new ErrorHandler("Chat is not a group chat", 400));
  chat.members.filter((member) => member.toString() !== req.userId.toString());
  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== req.userId.toString()
  );
  if (remainingMembers.length < 3) {
    return next(
      new ErrorHandler(
        "Cannot remove members a group must have atleast 3 members"
      )
    );
  }
  if (chat.creator.toString() === req.userId.toString()) {
    const randomIndex = Math.floor(Math.random() * remainingMembers.length);
    const newCreator = remainingMembers[randomIndex];
    chat.creator = newCreator;
  }
  chat.members = remainingMembers;

  const [user] = await Promise.all([
    User.findById(req.userId, "name"),
    chat.save(),
  ]);

  emmitEvent(
    req,
    ALERT,
    chat.members,
    `${user.name} has been removed from the group`
  );
  return res.status(200).json({
    sucess: true,
    mesage: `${user.name} has left the group`,
  });
});
const sendAttachments = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const files = req.files || [];
  if (files.length <1) return next(new ErrorHandler("Please Upload Attachments",400))
  if (files.length >10) return next(new ErrorHandler("Attachments Length Cannot Be More Than 10",400))
  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.userId, "name"),
  ]);
  if (!chat) return next(new ErrorHandler("Chat not Found", 404));
  if (files.length < 1)
    return next(new ErrorHandler("Please Provide Attachments", 400));

  // upload files
  const attachments = [];

  const messageForDB = {
    content: "",
    sender: req.userId,
    attachments,
    chat: chatId,
  };
  const messageForRealTime = {
    ...messageForDB,
    sender: { _id: req.userId, name: me.name },
  };
  const message = await Message.create(messageForDB);
  if (!message)
    return next(new ErrorHandler("Error while creating a new Message", 500));
  emmitEvent(req, NEW_ATTACHMENTS, chat.members, {
    message: messageForRealTime,
    chatId,
  });
  emmitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });
  return res.status(200).json({
    sucess: true,
    message,
  });
});
const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    // lean property helps to remove chat object from mongodb databse and add it to the js object
    // so any changes to the chat wont affect the mongodb database object
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();
    if (!chat) return next(new ErrorHandler("Chat not Found", 404));
    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));
    res.status(200).json({
      sucess: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return next(new ErrorHandler("Chat not Found", 404));
    res.status(200).json({
      sucess: true,
      chat,
    });
  }
});
const deleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not Found", 404));
  const members = chat.members;
  if (chat.groupChat && chat.creator.toString() !== req.userId.toString())
    return next(new ErrorHandler("Only admin can rename the group", 400));
  if (!chat.groupChat && !chat.members.include(req.userId).toString)
    return next(
      new ErrorHandler("You are not allowed to delete this chat", 400)
    );
  // before deleting chats we first have to delete all messages and attachments belonging to the chat
  const chatsWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });
  const publicIds = [];
  chatsWithAttachments.forEach(({ attachment }) => {
    attachment.forEach(({ public_id }) => publicIds.push(public_id));
  });
  await Promise.all([
    deleteFilesFromCloudinary(publicIds),Chat.deleteOne(),Message.deleteMany({chat:chatId})
  ])
  emmitEvent(req,REFETCH_CHATS,members)
  res.status(200).json({
    sucess:true,
    message:"Chat deleted sucessfully"
  })
});
const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not Found", 404));
  if (chat.creator.toString() !== req.userId.toString())
    return next(new ErrorHandler("Only admin can rename the group", 400));
  chat.name = name;
  await chat.save();
  emmitEvent(req, REFETCH_CHATS, chat.members);
  res.status(200).json({
    sucess: true,
    message: "Group renamed sucessfully",
  });
});
const getMessages = TryCatch(async(req,res,next)=>{
  const chatId = req.params.id
  const {page = 1} = req.body
  const limit =10
  const skip = (page-1)*limit

  const [messages,totalMessageCount] =await Promise.all([Message.find({chat:chatId})
  .sort({createdAt:-1})
  .limit(limit)
  .skip(skip)
  .populate("sender","name avatar")
  .lean(),Message.countDocuments({chat:chatId})])
  const totalPages = Math.ceil(totalMessageCount/limit)

  res.status(200).json({
    sucess:true,
    messages:messages.reverse(),
    totalPages
  })

})
export {
  newGroupChat,
  getMychats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  deleteChat,
  renameGroup,
  getMessages
};
