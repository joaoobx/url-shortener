import AppError from '@src/Errors/AppError';
import { celebrate, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

export default function PermissiveMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const companyRequest = celebrate({
    [Segments.BODY]: {},
  });

  companyRequest(request, response, (err: Express.Response) => {
    if (err) {
      next(new AppError('Dados inválidos'));
    }

    next();
  });
}
