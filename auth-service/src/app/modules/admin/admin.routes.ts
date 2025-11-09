import express from 'express';
import { AdminController } from './admin.controller';
import { ENUM_USER_ROLE } from '../../../enums';
import userContext from '../../middleware/userContext';

const router = express.Router();

router.get(
  '/all-users',
  userContext(ENUM_USER_ROLE.ADMIN),
  AdminController.allUsers
);

router.get(
  '/user-details/:userId',
  userContext(ENUM_USER_ROLE.ADMIN),
  AdminController.userDetails
);

router.patch(
  '/create-admin/:userId',
  userContext(),
  AdminController.createAdmin
);

export const AdminRoutes = router;
