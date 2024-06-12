import { adminSceretKey } from "../app.js";
import { User } from "../models/userModel.js";
import { ErrorHandler, TryCatch } from "./error.js";
import jwt from "jsonwebtoken";
const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["wollo-token"];
  console.log(token)
  if (!token) 
    return next(new ErrorHandler("Please login to access this page", 400));
  const decodedData = jwt.verify(token, process.env.JWT_SCECRET);
  req.userId = decodedData._id;
  next();
});
const isAuthenticatedAsAdmin = TryCatch(async (req, res, next) => {
  const token = req.cookies["wollo-admin"];
  if (!token) return next(new ErrorHandler("Only Admin can access this page", 400));
  const sceretKey = jwt.verify(token, process.env.JWT_SCECRET);
  console.log(sceretKey)
  const isMatched = sceretKey  === adminSceretKey
  if(!isMatched) return next(new ErrorHandler("Only Admin can access this page", 400));
  next();
});
export { isAuthenticated,isAuthenticatedAsAdmin };
