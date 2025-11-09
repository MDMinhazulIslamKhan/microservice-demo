import { Model, Types } from 'mongoose';
import { UserRoles } from './user.constant';

export type IUser = {
  _id: Types.ObjectId;
  syncId: string;
  email: string;
  name: string;
  role: UserRoles;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * @ignore
 */
export type UserModel = Model<IUser, Record<string, unknown>>;

export type NewUserEventData = {
  id: string;
  email: string;
  name: string;
  role?: UserRoles;
};

export type UpdateUserEventData = {
  id: string;
  name?: string;
  role?: UserRoles;
};
