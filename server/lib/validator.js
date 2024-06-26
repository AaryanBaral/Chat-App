import { body, validationResult, param } from "express-validator";
import { ErrorHandler } from "../middlewares/error.js";
const validatorHandler = (req, res, next) => {
  const errors = validationResult(req);
  const errorMassage = errors
    .array()
    .map((error) => error.msg)
    .join(",");
  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMassage, 400));
};
const registerValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("bio", "Please Enter Bio").notEmpty(),
  body("username", "Please Enter Username").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];
const loginValidator = () => [
  body("username", "Please Enter Username").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];
const newGroupValidator = () => [
  body("name", "Please Enter Username").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 2, max: 100 })
    .withMessage("Member must be between 2-100"),
];
const addMemberValidator = () => [
  body("chatId", "Please Enter chatId").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 1, max: 97 })
    .withMessage("Member must be between 1-97"),
];
const removeMemberValidator = () => [
  body("chatId", "Please Enter chatId").notEmpty(),
  body("userId", "Please Enter userId").notEmpty(),
];
const leaveGroupValidator = () => [
  param("id", "Please Provide chatId").notEmpty(),
];
const sendAttachmentsValidator = () => [
  body("chatId", "Please Provide chatId").notEmpty(),
];
const chatIdValidator = () => [
    param("id", "Please Provide chatId").notEmpty(),
];
const renameGroupValidator = () => [
    param("id", "Please Provide chatId").notEmpty(),
    param("name", "Please Provide Name").notEmpty(),
];
const sendFriendRequestValidator = () => [
    body("userId", "Please Provide User Id").notEmpty(),
];
const acceptFriendRequestValidator = () => [
    body("requestId", "Please Provide Request Id").notEmpty(),
    body("accept").notEmpty().withMessage("Please Add Accept").isBoolean().withMessage("Accept Must Be Boolean")
];
const adminLoginValidator = () => [
    body("sceretKey", "Please Provide Sceret Key").notEmpty(),
];

export {
  registerValidator,
  validatorHandler,
  loginValidator,
  newGroupValidator,
  addMemberValidator,
  removeMemberValidator,
  leaveGroupValidator,
  sendAttachmentsValidator,
  chatIdValidator,
  renameGroupValidator,
  acceptFriendRequestValidator,
  sendFriendRequestValidator,
  adminLoginValidator,
};
