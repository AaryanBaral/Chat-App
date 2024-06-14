import jwt from "jsonwebtoken";

const cookieOption = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SCECRET);
  return res.status(code).cookie("wollo-token", token, cookieOption).json({
    message,
    sucess: true,
  });
};
export { sendToken, cookieOption };
