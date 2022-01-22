import { Document } from 'mongoose';
// User interface
export interface IUserDocument extends Document {
  name: string;
  lastname: string;
  email: string;
  password: string;
  password2: string;
  token: string;
}
