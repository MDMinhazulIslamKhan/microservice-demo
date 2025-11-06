import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidation } from './auth.validation';
import userContext from '../../middleware/userContext';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginUserZodSchema),
  AuthController.login
);

router.post(
  '/registration',
  validateRequest(AuthValidation.registrationUserZodSchema),
  AuthController.userRegistration
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenTokenZodSchema),
  AuthController.refreshToken
);

router.patch(
  '/change-password',
  userContext(),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
