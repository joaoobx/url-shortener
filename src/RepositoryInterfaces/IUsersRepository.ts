import ICreateUserDTO from '@src/DTOs/ICreateUserDTO';
import User from '@src/Entities/User';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  loginByEmailAndPassword(
    email: string,
    password: string
  ): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: number): Promise<User>;
  updateLoginToken(user: User, hash: string): Promise<User>;
}
