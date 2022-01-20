import User from '../models/user';
import { Request, Response, NextFunction } from 'express';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth;
  const user = User.findByToken(token);
  if (!user) {
    res.send('You must login or register first');
  } else {
    next();
  }
};

export default auth;
