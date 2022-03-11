import { inject, injectable } from 'tsyringe';
import User from '@src/Entities/User';
import AppError from '@src/Errors/AppError';
import CryptoJS from 'crypto-js';
import IUsersRepository from '@src/RepositoryInterfaces/IUsersRepository';

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    const findEmail = await this.usersRepository.findByEmail(email);

    if (findEmail) {
      throw new AppError('Email já encontrado');
    }

    if (!process.env.APP_SECRET) {
      throw new AppError('Autenticação da senha negada');
    }

    const encrypted = CryptoJS.HmacMD5(
      password,
      process.env.APP_SECRET
    ).toString();

    const user = await this.usersRepository.create({
      name,
      email,
      password: encrypted,
    });

    return user;
  }
}
