const errorMiddleWare = (err, req, res, next) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;
  res.status(err.statusCode).json({
    sucess: false,
    message: err.message,
  });
};

const TryCatch = (passedFunction) => async (req, res, next) => {
  try {
    passedFunction(req, res, next);
  } catch (err) {
    console.log("err",err)
    return next(new ErrorHandler(err));
  }
};

class ErrorHandler extends Error {
  constructor(message, statusCode=500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { errorMiddleWare, TryCatch, ErrorHandler };
