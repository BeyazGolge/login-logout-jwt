import * as bcrypt from 'bcrypt';
import { Document, Schema, Model, model } from 'mongoose';

import { IUserDocument } from '../interfaces/IUserDocument';

import jwt from 'jsonwebtoken';

import { get } from '../config/config';
const nodeEnv = 'NODE_ENV';

const config = get(
  process.env[nodeEnv] === 'production' ? 'production' : 'default'
);
const salt = 10;

export interface IUser extends IUserDocument {
  comparePassword(password: string): boolean;
  generateToken(): void;
  deleteToken(): Document;
}

export interface IUserModel extends Model<IUser> {
  findByToken(token: string): IUser | null;
}

export const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
  },
  password2: {
    type: String,
    require: true,
  },
  token: {
    type: String,
  },
});

userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(salt, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        user.password2 = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.method('comparePassword', async function (password: string) {
  return await bcrypt.compare(password, this.password);
});

userSchema.method('generateToken', async function () {
  const token: string = jwt.sign(this._id.toHexString(), config.SECRET);
  this.token = token;
  await this.save();
});

userSchema.method('deleteToken', async function () {
  try {
    this.updateOne({ $unset: { token: 1 } });
  } catch (error) {
    throw error;
  }
});

userSchema.static('findByToken', async function (token) {
  try {
    const decodedToken = jwt.verify(token, config.SECRET);
    return await this.findOne({ _id: decodedToken, token });
  } catch (error) {
    throw error;
  }
});

export const User: IUserModel = model<IUserDocument, IUserModel>(
  'User',
  userSchema
);

export default User;
