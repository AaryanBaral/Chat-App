import { adminSceretKey } from "../app.js";
import { WOLLO_TOKEN } from "../constants/configure.js";
import { User } from "../models/userModel.js";
import { ErrorHandler, TryCatch } from "./error.js";
import jwt from "jsonwebtoken";
const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies[WOLLO_TOKEN];
  if (!token)
    return next(new ErrorHandler("Please login to access this page", 400));
  const decodedData = jwt.verify(token, process.env.JWT_SCECRET);
  req.userId = decodedData._id;
  next();
});
const isAuthenticatedAsAdmin = TryCatch(async (req, res, next) => {
  const token = req.cookies["wollo-admin"];
  if (!token)
    return next(new ErrorHandler("Only Admin can access this page", 400));
  const sceretKey = jwt.verify(token, process.env.JWT_SCECRET);
  console.log(sceretKey);
  const isMatched = sceretKey === adminSceretKey;
  if (!isMatched)
    return next(new ErrorHandler("Only Admin can access this page", 400));
  next();
});

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);
    const authToken = socket.request.cookies[WOLLO_TOKEN];
    if (!authToken)
      return next(new ErrorHandler("Please login to acces this route",401));
    const decodedData = jwt.verify(authToken, process.env.JWT_SCECRET);

    const user = await User.findById(decodedData._id);
    if(!user) return next(new ErrorHandler("Please login to acces this route",401));
    socket.user = user
    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to acces this route",401));
  }
};
export { isAuthenticated, isAuthenticatedAsAdmin, socketAuthenticator };
