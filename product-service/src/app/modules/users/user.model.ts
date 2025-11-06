import { Schema, model } from 'mongoose';
import { userRolesList } from './user.constant';
import { IUser, UserModel } from './user.interface';

const UserSchema = new Schema<IUser, UserModel>(
  {
    syncId: {
      type: String,
      unique: [true, 'Already used this id.'],
      required: [true, 'Sync id is required.'],
      maxLength: [50, 'Too big id'],
    },
    email: {
      type: String,
      unique: [true, 'Already used this email.'],
      lowercase: true,
      trim: true,
      required: [true, 'Email is required.'],
      minLength: [6, 'Invalid email.'],
      maxLength: [255, 'Invalid email.'],
    },
    name: {
      type: String,
      index: true,
      required: [true, 'Name is required.'],
      minLength: [3, 'Invalid name.'],
      maxLength: [150, 'Invalid name.'],
    },
    role: {
      type: String,
      default: 'USER',
      enum: userRolesList,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser, UserModel>('User', UserSchema);
