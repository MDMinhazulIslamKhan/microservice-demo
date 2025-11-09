import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';
import userContext from '../../middleware/userContext';
import { AdminController } from '../admin/admin.controller';

const router = express.Router();

router.get('/profile', userContext(), UserController.getProfileInfo);

router.patch(
  '/profile',
  userContext(),
  validateRequest(UserValidation.updateProfileZodSchema),
  UserController.updateProfile
);

router.patch(
  '/create-admin/:userId',
  userContext(),
  AdminController.createAdmin
);

export const UserRoutes = router;
