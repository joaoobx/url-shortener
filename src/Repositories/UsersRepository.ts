import ICreateUserDTO from '@src/DTOs/ICreateUserDTO';
import User from '@src/Entities/User';
import AppError from '@src/Errors/AppError';
import IUsersRepository from '@src/RepositoryInterfaces/IUsersRepository';
import { getRepository, Repository } from 'typeorm';
import { add } from 'date-fns';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async loginByEmailAndPassword(
    email: string,
    password: string
  ): Promise<User | undefined> {
    const foundEmail = await this.ormRepository.findOne({
      where: { email },
    });

    if (!foundEmail) {
      throw new AppError('E-mail não encontrado');
    }

    const login = await this.ormRepository.findOne({
      where: { email, password },
    });

    return login;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const foundEmail = await this.ormRepository.findOne({
      where: { email },
    });

    return foundEmail;
  }

  public async findById(id: number): Promise<User> {
    const foundUser = await this.ormRepository.findOne({
      where: { id },
    });

    if (!foundUser) {
      throw new AppError('Usuário não encontrado');
    }

    return foundUser;
  }

  public async updateLoginToken(user: User, hash: string): Promise<User> {
    user.token = hash;

    user.expiresAt = add(new Date(), {
      minutes: process.env.TIME_TO_EXPIRES_IN_MINUTES
        ? +process.env.TIME_TO_EXPIRES_IN_MINUTES
        : 15,
    });

    await this.ormRepository.save(user);

    return user;
  }
}

export default UsersRepository;
