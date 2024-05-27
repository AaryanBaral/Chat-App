import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";

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
    sucess: true,
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
    sucess: true,
    chats:transformedChats
  });
});
const allMessages = TryCatch(async(req,res,next)=>{
    
})
export { allUsers,allChats };
