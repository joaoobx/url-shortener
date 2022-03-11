import { Request, Response } from 'express';
import CreateUserService from '@src/Services/CreateUserService';
import LoginService from '@src/Services/LoginService';
import { container, injectable } from 'tsyringe';
import AppError from '@src/Errors/AppError';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

export default class UserController {
  public async register(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { name, email, password } = request.body as IRequest;

    const createUserService = container.resolve(CreateUserService);

    await createUserService.execute(name, email, password);

    return response.json({ mensagem: 'Usuário cadastrado!' });
  }

  public async login(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body as IRequest;

    const loginUserService = container.resolve(LoginService);

    const loggedUser = await loginUserService.execute(email, password);

    if (!loggedUser) {
      throw new AppError('Usuário não encontrado');
    }

    return response.json({
      mensagem: 'Login efetuado!',
      token: loggedUser?.token,
    });
  }
}
