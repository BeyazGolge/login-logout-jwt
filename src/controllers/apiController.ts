import User from '../models/user';
import { Request, Response } from 'express';

export const registerUser = async (req: Request, res: Response) => {
  const newuser = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    password2: req.body.password2,
  });

  if (newuser.password !== newuser.password2)
    return res.status(400).json({ message: 'password not match' });

  try {
    const user = await User.findOne({ email: newuser.email });
    if (user) {
      return res.status(400).json({ auth: false, message: 'email exists' });
    } else {
      await newuser.save();
      return res.status(200).redirect('/');
    }
  } catch (error) {
    return res.status(400).json({ auth: false, message: 'an error occured' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const token = req.cookies.auth;

  let user = User.findByToken(token);

  if (user) {
    return res.status(400).json({
      error: true,
      message: 'You are already logged in',
    });
  } else {
    user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        isAuth: false,
        message: ' Auth failed ,email not found',
      });
    } else {
      if (user.comparePassword(req.body.password)) {
        user.generateToken();
        return res.cookie('auth', user.token).redirect('/api/dashboard');
      } else {
        return res.json({
          isAuth: false,
          message: 'password doesnt match',
        });
      }
    }
  }
};

export const getDashboardPage = async (req: Request, res: Response) => {
  const users = await User.find();
  const token = req.cookies.auth;
  const user = User.findByToken(token)!;
  res.render('dashboard', {
    name: user.name + ' ' + user.lastname,
    users,
  });
};

export const logoutUser = async (req: Request, res: Response) => {
  const token = req.cookies.auth;
  const user = User.findByToken(token)!;
  user.deleteToken();
  res.status(200).redirect('/');
};
