require("dotenv").config();
const UserRouter = require("./routers/userRouter");
const PostRouter = require("./routers/postRouter");
const globalErrorHandler = require("./controllers/errorController");

const express = require("express");
const app = express();

app.use(express.json());
app.use(UserRouter);
app.use(PostRouter);

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is up and running at port keziInch!");
});

// process.on("unhandledRejection", (err) => {
//   console.log(err.name, err.message);
//   console.log("Unhandled Rejection! Shutting down!");
//   server.close(() => {
//     process.exit(1);
//   });
// });
