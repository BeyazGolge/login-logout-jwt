import * as bcrypt from 'bcrypt';
import User from '../entities/User';
import jwt from 'jsonwebtoken';
import { createQueryBuilder } from 'typeorm';
import { get } from '../config/config';
const nodeEnv = 'NODE_ENV';

const config = get(
  process.env[nodeEnv] === 'production' ? 'production' : 'default'
);
export async function comparePassword(
  incomingPassword: string,
  userPassword: string
) {
  return await bcrypt.compare(incomingPassword, userPassword);
}

export async function generateToken(user: User) {
  const token: string = jwt.sign(user.id!, config.SECRET);
  return token;
}

export async function findByToken(token: string) {
  const userID = jwt.verify(token, config.SECRET);
  const user = await createQueryBuilder('user')
    .select('user')
    .from(User, 'user')
    .where('user.id = :userID', { userID })
    .getOne();
  return user;
}

export async function findByEmail(userEmail: string) {
  const user = await createQueryBuilder('user')
    .select('user')
    .from(User, 'user')
    .where('user.email = :userEmail', { userEmail })
    .getOne();
  return user;
}
