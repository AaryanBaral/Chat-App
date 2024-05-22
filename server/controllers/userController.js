import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { cookieOption, sendToken } from "../utils/cookie.js";
import { ErrorHandler, TryCatch } from "../middlewares/error.js";
const newUser = TryCatch(async (req, res) => {
  const { name, username, password } = req.body;
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
    const {name} = req.query
    
  res
    .status(200)
    .json({
      sucess: true,
      message: name,
    });
});
export { login, newUser, getProfile, logout, searchUser };
