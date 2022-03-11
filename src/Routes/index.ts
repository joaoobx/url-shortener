import { Response, Router } from 'express';
import AppError from '../Errors/AppError';
import RegisterRouter from './RegisterRoutes';
import LoginRouter from './LoginRouter';
import UrlRouter from './UrlRouter';
import ListUrlRouter from './ListUrlRouter';
import RedirectRouter from './RedirectRouter';

const routes = Router();

routes.use('/', RedirectRouter);
routes.use('/register', RegisterRouter);
routes.use('/login', LoginRouter);
routes.use('/url', UrlRouter);
routes.use('/list', ListUrlRouter);

routes.use((error: Response) => {
  if (error) {
    throw new AppError('Rota inválida');
  }
});

export default routes;
