import User from '../models/user';
import { Request, Response } from 'express';

// Function used for Registering Users
export async function registerUser(req: Request, res: Response) {
  const newuser = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    password2: req.body.password2,
  });
  // Check if users passwords match, ask for password confirmation
  if (newuser.password !== newuser.password2)
    res.status(400).json({ message: 'password not match' });

  // Try to find user by email, if exists user cannot register again
  try {
    const user = await User.findOne({ email: newuser.email });
    if (user) {
      res.status(400).json({ auth: false, message: 'email exists' });
    } else {
      await newuser.save();
      res.status(200).redirect('/');
    }
  } catch (error) {
    res.status(400).json({ auth: false, message: 'an error occured' });
  }
}

// Function for logging in the user
export const loginUser = async (req: Request, res: Response) => {
  const token = req.cookies.auth;

  // Try to find the user by the token
  let user = await User.findByToken(token);

  // If user is found, cannot login again
  if (user) {
    return res.status(400).json({
      error: true,
      message: 'You are already logged in',
    });
  } else {
    // Try to find the user by email
    user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        isAuth: false,
        message: ' Auth failed ,email not found',
      });
    } else {
      // If user is found compare the passwords
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
  const user = await User.findByToken(token)!;
  res.render('dashboard', {
    name: user.name + ' ' + user.lastname,
    users,
  });
};

// Logs out the user by deleting the token form the users database document
export const logoutUser = async (req: Request, res: Response) => {
  const token = req.cookies.auth;
  const user = await User.findByToken(token)!;
  user.deleteToken();
  res.status(200).redirect('/');
};
