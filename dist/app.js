"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const apiRoute = require("./routes/apiRoute");
const User = require("./models/user");
const config = require("./config/config").get(process.env.NODE_ENV);
// const pageRoute = require("./routes/pageRoute");
const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(express.static("public"));
//Database connection
mongoose
    .connect(config.DATABASE, {
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
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.cookies.auth
        ? yield User.findOne({ token: req.cookies.auth })
        : null;
    res.status(200).render("index", {
        userIN: !!user,
    });
}));
app.use("/api", apiRoute);
app.listen(process.env.PORT || 3000, () => {
    console.log("App is live");
    console.log(process.env.NODE_ENV);
    console.log(process.env.SECRET);
    console.log(process.env.DATABASE);
});
