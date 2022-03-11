import AppError from '@src/Errors/AppError';
import FakeUsersRepository from '@src/Repositories/Fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let createUserService: CreateUserService;
let fakeUsersRepository: FakeUsersRepository;

describe('CreateUser', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    createUserService = new CreateUserService(fakeUsersRepository);

    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Should be able to create user', async () => {
    process.env.APP_SECRET = 'secret';

    await expect(
      createUserService.execute('John Doe', 'johndoe@gmail.com', '123456')
    ).resolves.not.toThrow();
  });

  it('Should not be able to create user (e-mail already exists)', async () => {
    process.env.APP_SECRET = 'secret';

    await createUserService.execute('Mary Doe', 'johndoe@gmail.com', '654321');

    await expect(
      createUserService.execute('John Doe', 'johndoe@gmail.com', '123456')
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create user (no app secret)', async () => {
    await expect(
      createUserService.execute('John Doe', 'johndoe@gmail.com', '123456')
    ).rejects.toBeInstanceOf(AppError);
  });
});
