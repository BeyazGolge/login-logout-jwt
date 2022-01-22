import * as bcrypt from 'bcrypt';
import { Schema, Model, model } from 'mongoose';

import { IUserDocument } from '../interfaces/IUserDocument';

import jwt from 'jsonwebtoken';

import { get } from '../config/config';
const nodeEnv = 'NODE_ENV';

const config = get(
  process.env[nodeEnv] === 'production' ? 'production' : 'default'
);
const salt = 10;

// Add Documents methods
export interface IUser extends IUserDocument {
  comparePassword(password: string): boolean;
  generateToken(): void;
  deleteToken(): void;
}

// Add Models methods
export interface IUserModel extends Model<IUser> {
  findByToken(token: string): IUser | null;
}

// Create a User Schema
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

// Before saving check if the password is modified, if modified hash the password
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

// Compare the password given by the user with password in the database
userSchema.method('comparePassword', async function (password: string) {
  return await bcrypt.compare(password, this.password);
});

// Generate a token with the users ID and write it to users database
userSchema.method('generateToken', async function () {
  const token: string = jwt.sign(this._id.toHexString(), config.SECRET);
  this.token = token;
  await this.save();
});

// Delete the token from the database
userSchema.method('deleteToken', async function () {
  try {
    await this.updateOne({ $unset: { token: 1 } });
  } catch (error) {
    throw error;
  }
});

// Find the user by using the token in cookie
userSchema.static('findByToken', async function (token) {
  if (token) {
    try {
      const decodedToken = await jwt.verify(token, config.SECRET);
      return await this.findOne({ _id: decodedToken, token });
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
});

export const User: IUserModel = model<IUserDocument, IUserModel>(
  'User',
  userSchema
);

export default User;
