require("dotenv").config();
const router = require("./routers/userRouter");

const express = require("express");
const app = express();

app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is up and running at port keziInch!");
});
