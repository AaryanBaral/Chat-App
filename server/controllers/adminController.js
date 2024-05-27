import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
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
export { allUsers };
