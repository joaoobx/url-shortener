import { NextFunction, Request, Response } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import AppError from '@src/Errors/AppError';

export default function UserLoginMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const companyRequest = celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  });

  companyRequest(request, response, (err: Express.Response) => {
    if (err) {
      next(new AppError('Dados inválidos'));
    }

    next();
  });
}
