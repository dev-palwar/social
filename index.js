require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const userRouter = require("./Routes/users");
const connectDatbase = require("./Database/config");
const postRouter = require("./Routes/posts");
const ifAuthenticated = require("./middlewares/Auth");

connectDatbase();

app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/post", ifAuthenticated, postRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server running smooth on port ${process.env.PORT}`);
});