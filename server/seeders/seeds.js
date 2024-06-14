import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { faker, simpleFaker } from "@faker-js/faker";

const createUser = async (numMembers) => {
  try {
    const userPromise = [];
    for (let i = 0; i < numMembers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: "password",
        bio: faker.lorem.sentence(10),
        avatar: {
          public_id: faker.system.fileName(),
          url: faker.image.avatar(),
        },
      });
      userPromise.push(tempUser);
    }
    await Promise.all(userPromise);
    console.log("user Created", userPromise);
    process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
const createSingleChat = async (numChats) => {
  try {
    const users = await User.find().select("_id");
    const chatsPromise = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        chatsPromise.push(
          Chat.create({
            name: faker.lorem.words(2),
            members: [users[i], users[j]],
          })
        );
      }
    }
    await Promise.all(chatsPromise);
    console.log("Chat created sucessfully");
    process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
const createGroupChat = async (numChats) => {
  try {
    const users = await User.find().select("_id");
    const chatsPromise = [];
    for (let i = 0; i < numChats; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
      const members = [];
      for (let i = 0; i < numMembers; i++) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];
        // Ensure the same user is not added twice
        if (!members.includes(randomUser)) {
          members.push(randomUser);
        }
      }
      const chat = Chat.create({
        groupChat: true,
        name: faker.lorem.word(2),
        members,
        creator: members[0],
      });
      chatsPromise.push(chat)
    }
    await Promise.all(chatsPromise)
    console.log("Chat created sucessfully");
    process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
const createMessage = async (numMessages) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");
    const messagesPromise = [];
    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];
      messagesPromise.push(
        Message.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }
    await Promise.all(messagesPromise);
    console.log("message created sucessfully");
    process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
const createMessageInAChat = async(chatId,numMessages)=>{
    try {
        const users = await User.find().select("_id");
        const messagesPromise = [];
        for (let i = 0; i < numMessages; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            messagesPromise.push(
              Message.create({
                chat: chatId,
                sender: randomUser,
                content: faker.lorem.sentence(),
              })
            );
          }
        await Promise.all(messagesPromise)
        console.log("messages created Sucessfully");
        process.exit(1);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export { createUser, createGroupChat,createMessage,createMessageInAChat,createSingleChat };
