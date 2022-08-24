require("dotenv").config();
const UserRouter = require("./routers/userRouter");
const PostRouter = require("./routers/postRouter");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception!!! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const express = require("express");
const app = express();

app.use(express.json());
app.use(UserRouter);
app.use(PostRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is up and running at port keziInch!");
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down...");
  console.log(err.name, err.message);
  app.close(() => {
    process.exit(1);
  });
});
