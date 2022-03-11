import ICreateUserDTO from '@src/DTOs/ICreateUserDTO';
import User from '@src/Entities/User';
import AppError from '@src/Errors/AppError';
import IUsersRepository from '@src/RepositoryInterfaces/IUsersRepository';
import { add } from 'date-fns';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: this.users.length }, userData);

    this.users.push(user);

    return Promise.resolve(user);
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(
      (requestedUser: User) => requestedUser.id === user.id
    );

    this.users[findIndex] = user;

    return Promise.resolve(user);
  }

  public async loginByEmailAndPassword(
    email: string,
    password: string
  ): Promise<User | undefined> {
    const findUser = this.users.find(
      (requestedUser: User) => String(requestedUser.email) === String(email)
    );

    if (!findUser) {
      throw new AppError('E-mail não encontrado');
    }

    const login = this.users.find(
      (requestedUser: User) =>
        String(requestedUser.email) === String(email) &&
        String(requestedUser.password) === String(password)
    );

    return Promise.resolve(login);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(
      (user: User) => String(user.email) === String(email)
    );

    return Promise.resolve(findUser);
  }

  public async findById(id: number): Promise<User> {
    const findUser = this.users.find(
      (requestedUser: User) => String(requestedUser.id) === String(id)
    );

    if (!findUser) {
      throw new AppError('Usuário não encontrado');
    }

    return Promise.resolve(findUser);
  }

  public async updateLoginToken(user: User, hash: string): Promise<User> {
    user.token = hash;

    user.expiresAt = add(new Date(), {
      minutes: process.env.TIME_TO_EXPIRES_IN_MINUTES
        ? +process.env.TIME_TO_EXPIRES_IN_MINUTES
        : 15,
    });

    return Promise.resolve(user);
  }
}

export default FakeUsersRepository;
