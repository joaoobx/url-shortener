import AppError from '@src/Errors/AppError';
import auth from '@src/Utils/auth';
import { convertFromHex } from '@src/Utils/hex';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureUserIsLogged(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Usuário não logado');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, auth.jwt.secret);

    const { sub } = decoded as ITokenPayload;

    const [hexCpf] = sub.split('-');
    const id = convertFromHex(hexCpf);
    const convertedId = parseInt(id, 10);
    request.user = {
      token,
      id: convertedId,
    };

    return next();
  } catch {
    throw new AppError('Autenticação inválida', 401);
  }
}
