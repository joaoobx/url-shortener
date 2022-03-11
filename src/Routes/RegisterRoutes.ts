import UserController from '@src/Controllers/UserController';
import UserCreationMiddleware from '@src/Middlewares/RouteValidators/UserCreationMiddleware';
import { Router } from 'express';

const RegisterRouter = Router();
const userController = new UserController();

RegisterRouter.post(
  '',
  UserCreationMiddleware,
  userController.register.bind(userController)
);

export default RegisterRouter;
