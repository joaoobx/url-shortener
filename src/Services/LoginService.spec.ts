import AppError from '@src/Errors/AppError';
import FakeUsersRepository from '@src/Repositories/Fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import LoginService from './LoginService';

let loginService: LoginService;
let createUserService: CreateUserService;
let fakeUsersRepository: FakeUsersRepository;

describe('LoginService', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    loginService = new LoginService(fakeUsersRepository);
    createUserService = new CreateUserService(fakeUsersRepository);

    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Should be able login', async () => {
    process.env.APP_SECRET = 'secret';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    await expect(
      loginService.execute(user.email, '123456')
    ).resolves.not.toThrow();
  });

  it('Should not be able login (user not registered)', async () => {
    process.env.APP_SECRET = 'secret';

    await expect(
      loginService.execute('nonexistent@gmail.com', '123456')
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able login (app secret does not exist)', async () => {
    process.env.APP_SECRET = 'secret';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    process.env = OLD_ENV;

    await expect(
      loginService.execute(user.email, '123456')
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able login (app secret does not exist)', async () => {
    process.env.APP_SECRET = 'secret';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    await expect(
      loginService.execute(user.email, 'wrongpassword')
    ).rejects.toBeInstanceOf(AppError);
  });
});
