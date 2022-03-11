import UrlController from '@src/Controllers/UrlController';
import checkIfUserIsLogged from '@src/Middlewares/BusinessRuleValidators/CheckIfUserIsLogged';
import ensureUserIsLogged from '@src/Middlewares/BusinessRuleValidators/EnsureUserIsLogged';
import DeleteUrlMiddleware from '@src/Middlewares/RouteValidators/DeleteUrlMiddleware';
import UrlMiddleware from '@src/Middlewares/RouteValidators/UrlMiddleware';
import { Router } from 'express';

const LoginRouter = Router();
const urlController = new UrlController();

LoginRouter.post(
  '',
  UrlMiddleware,
  checkIfUserIsLogged,
  urlController.shorten.bind(urlController)
);
LoginRouter.post(
  '/delete',
  DeleteUrlMiddleware,
  ensureUserIsLogged,
  urlController.delete.bind(urlController)
);

export default LoginRouter;
