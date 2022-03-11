import { inject, injectable } from 'tsyringe';
import AppError from '@src/Errors/AppError';
import authConfig from '@src/Utils/auth';
import { sign } from 'jsonwebtoken';
import { convertToHex } from '@src/Utils/hex';
import CryptoJS from 'crypto-js';
import IUsersRepository from '@src/RepositoryInterfaces/IUsersRepository';

@injectable()
export default class LoginService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(email: string, password: string) {
    const findUser = await this.usersRepository.findByEmail(email);

    if (!findUser) {
      throw new AppError('Usuário não encontrado');
    }

    if (!process.env.APP_SECRET) {
      throw new AppError('Não foi possível autenticar a senha');
    }

    const userPassword = findUser.password;

    const encryptedPassword = CryptoJS.HmacMD5(
      password,
      process.env.APP_SECRET
    ).toString();

    const { secret, expiresIn } = authConfig.jwt;

    const hexId = convertToHex(String(findUser.id));

    const token = sign({}, secret, {
      subject: `${hexId} + '-' + ${String(findUser.id)}`,
      expiresIn,
    });

    await this.usersRepository.updateLoginToken(findUser, token);

    if (encryptedPassword !== userPassword) {
      throw new AppError('Dados inválidos');
    }

    const user = await this.usersRepository.loginByEmailAndPassword(
      email,
      encryptedPassword
    );

    return user;
  }
}
