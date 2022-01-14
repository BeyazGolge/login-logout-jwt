const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const apiRoute = require("./routes/apiRoute");
const User = require("./models/user");

// const pageRoute = require("./routes/pageRoute");

const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(express.static("public"));

//Database connection
mongoose
  .connect("mongodb://localhost/basicJwt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to db succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

let userIN = null;

app.get("/", async (req, res) => {
  const user = await User.findOne({ token: req.cookies.auth });
  if (user) {
    userIN = true;
  } else {
    userIN = false;
  }
  res.status(200).render("index", {
    userIN,
  });
});

app.use("/api", apiRoute);

app.listen(3000, () => {
  console.log("App is live");
});
