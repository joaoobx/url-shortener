import UserController from '@src/Controllers/UserController';
import { Router } from 'express';
import UserLoginMiddleware from '@src/Middlewares/RouteValidators/UserLoginMiddleware';

const LoginRouter = Router();
const userController = new UserController();

LoginRouter.post(
  '',
  UserLoginMiddleware,
  userController.login.bind(userController)
);

export default LoginRouter;
