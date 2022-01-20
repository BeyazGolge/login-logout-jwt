import User from '../models/user';
import { Request, Response, NextFunction } from 'express';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth;
  const user = await User.findByToken(token);
  if (!user) {
    return res.send('You must login or register first');
  } else {
    return next();
  }
};

export default auth;
