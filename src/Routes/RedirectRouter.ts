import UrlController from '@src/Controllers/UrlController';
import UrlMiddleware from '@src/Middlewares/RouteValidators/UrlMiddleware';
import { Router } from 'express';

const RedirectRouter = Router();
const urlController = new UrlController();

RedirectRouter.get(
  '/redirect/:url',
  UrlMiddleware,
  urlController.redirect.bind(urlController)
);

export default RedirectRouter;
