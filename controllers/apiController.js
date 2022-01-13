const User = require("../models/user");

exports.registerUser = async (req, res) => {
  console.log(req.body);
  const newuser = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    password2: req.body.password2,
  });

  if (newuser.password != newuser.password2)
    return res.status(400).json({ message: "password not match" });

  User.findOne({ email: newuser.email }, function (err, user) {
    if (user)
      return res.status(400).json({ auth: false, message: "email exits" });

    newuser.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }

      res.status(200).redirect("/");
    });
  });
};

exports.loginUser = async (req, res) => {
  let token = req.cookies.auth;
  User.findByToken(token, (err, user) => {
    if (err) return res(err);
    if (user)
      return res.status(400).json({
        error: true,
        message: "You are already logged in",
      });
    else {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user)
          return res.json({
            isAuth: false,
            message: " Auth failed ,email not found",
          });

        user.comparepassword(req.body.password, (err, isMatch) => {
          if (!isMatch)
            return res.json({
              isAuth: false,
              message: "password doesn't match",
            });

          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.cookie("auth", user.token).json({
              isAuth: true,
              id: user._id,
              email: user.email,
            });
          });
        });
      });
    }
  });
};

exports.getDashboardPage = async (req, res) => {
  res.json({
    isAuth: true,
    id: req.user._id,
    email: req.user.email,
    name: req.user.name + req.user.lastname,
  });
};

exports.logoutUser = async (req, res) => {
  req.user.deleteToken(req.token, (err, user) => {
    if (err) return res.status(400).send(err);
    res.sendStatus(200);
  });
};
