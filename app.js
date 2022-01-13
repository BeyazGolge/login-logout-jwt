const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const apiRoute = require("./routes/apiRoute");
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

app.get("/", (req, res) => {
  res.status(200).render("index");
});

app.use("/api", apiRoute);

app.listen(3000, () => {
  console.log("App is live");
});
