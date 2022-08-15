require("dotenv").config();
const UserRouter = require("./routers/userRouter");
const PostRouter = require("./routers/postRouter");

const express = require("express");
const app = express();

app.use(express.json());
app.use(UserRouter);
app.use(PostRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is up and running at port keziInch!");
});
