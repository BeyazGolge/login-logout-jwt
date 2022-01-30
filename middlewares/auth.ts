import * as userMethods from '../entity-methods/User-methods';
import { Request, Response, NextFunction } from 'express';

// Checks if there is a database entry with the Token in the cookies, if found user is already logged in
const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth;
  const user = await userMethods.findByToken(token);
  if (!user) {
    return res.send('You must login or register first');
  } else {
    return next();
  }
};

export default auth;
