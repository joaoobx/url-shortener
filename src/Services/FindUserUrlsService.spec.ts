import FakeUrlsRepository from '@src/Repositories/Fakes/FakeUrlsRepository';
import FakeUsersRepository from '@src/Repositories/Fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FindUserUrlsService from './FindUserUrlsService';

let findUserUrlsService: FindUserUrlsService;
let createUserService: CreateUserService;
let fakeUrlsRepository: FakeUrlsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('FindUserUrls', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    fakeUrlsRepository = new FakeUrlsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    findUserUrlsService = new FindUserUrlsService(fakeUrlsRepository);
    createUserService = new CreateUserService(fakeUsersRepository);

    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Should be able to find user urls', async () => {
    process.env.APP_SECRET = 'secret';
    process.env.APP_HOST = 'http://localhost:3000';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    await expect(findUserUrlsService.execute(user.id)).resolves.not.toThrow();
  });
});
