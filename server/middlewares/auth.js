import { User } from "../models/userModel.js";
import { ErrorHandler, TryCatch } from "./error.js";
import jwt from "jsonwebtoken";
const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["wollo-token"];
  if (!token)
    return next(new ErrorHandler("Please login to access this page", 400));
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decodedData._id;
  next();
});
export { isAuthenticated };
