import User from '../entities/User';
import * as userMethods from '../entity-methods/User-methods';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

export async function registerUser(req: Request, res: Response) {
  let password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const user = User.create({
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    password,
  });
  try {
    const checkUser = await userMethods.findByEmail(user.email!);
    if (checkUser) {
      res.status(400).json({ auth: false, message: 'email exists' });
    } else {
      await user.save();
      res.redirect('/');
    }
  } catch (error) {
    res.status(400).json({ auth: false, message: 'an error occured' });
  }
}

export async function loginUser(req: Request, res: Response) {
  const token = req.cookies.auth;
  if (!!token) {
    const user = userMethods.findByToken(token);
    if (!!user) {
      res.status(400).json({
        error: true,
        message: 'You are already logged in',
      });
    }
  } else {
    const user = await userMethods.findByEmail(req.body.email);
    if (!!user) {
      if (
        await userMethods.comparePassword(req.body.password, user.password!)
      ) {
        const token = await userMethods.generateToken(user);
        res.cookie('auth', token).redirect('/user/dashboard');
      } else {
        res.json({ isAuth: false, message: 'passwords does not match' });
      }
    }
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    const token = req.cookies.auth;
    console.log(token);
    res.clearCookie('auth').redirect('/');
  } catch (error) {
    res.redirect('/');
  }
}

export async function getDashboardPage(req: Request, res: Response) {
  const users = await User.find();
  const token = req.cookies.auth;
  const user = await userMethods.findByToken(token);
  res.render('dashboard', {
    name: user!.name + ' ' + user!.lastname,
    users,
  });
}
