import { NextFunction, Request, Response } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import AppError from '@src/Errors/AppError';

export default function DeleteUrlMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const urlRequest = celebrate({
    [Segments.BODY]: {
      id: Joi.string().required(),
    },
  });

  urlRequest(request, response, (err: Express.Response) => {
    if (err) {
      next(new AppError('Dados inválidos'));
    }

    next();
  });
}
