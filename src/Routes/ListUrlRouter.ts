import UrlController from '@src/Controllers/UrlController';
import ensureUserIsLogged from '@src/Middlewares/BusinessRuleValidators/EnsureUserIsLogged';
import PermissiveMiddleware from '@src/Middlewares/RouteValidators/PermissiveMiddleware';
import { Router } from 'express';

const ListUrlRouter = Router();
const urlController = new UrlController();

ListUrlRouter.get(
  '/user',
  ensureUserIsLogged,
  urlController.listUserUrls.bind(urlController)
);
ListUrlRouter.get(
  '',
  PermissiveMiddleware,
  urlController.listTop100.bind(urlController)
);

export default ListUrlRouter;
