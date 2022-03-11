import AppError from '@src/Errors/AppError';
import FakeUrlsRepository from '@src/Repositories/Fakes/FakeUrlsRepository';
import FakeUsersRepository from '@src/Repositories/Fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import RedirectUrlService from './RedirectUrlService';
import ShortenUrlService from './ShortenUrlService';

let redirectUrlService: RedirectUrlService;
let shortenUrlService: ShortenUrlService;
let createUserService: CreateUserService;
let fakeUrlsRepository: FakeUrlsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('RedirectUrl', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    fakeUrlsRepository = new FakeUrlsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    redirectUrlService = new RedirectUrlService(fakeUrlsRepository);
    shortenUrlService = new ShortenUrlService(
      fakeUrlsRepository,
      fakeUsersRepository
    );
    createUserService = new CreateUserService(fakeUsersRepository);

    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Should be able to redirect url', async () => {
    process.env.APP_SECRET = 'secret';
    process.env.APP_HOST = 'http://localhost:3000';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    const url = await shortenUrlService.execute(
      'http://www.google.com',
      user.id
    );

    await expect(
      redirectUrlService.execute(url.urlCode)
    ).resolves.not.toThrow();
  });

  it('Should not be able to redirect url (non existent url code)', async () => {
    process.env.APP_SECRET = 'secret';
    process.env.APP_HOST = 'http://localhost:3000';

    await expect(
      redirectUrlService.execute('doesnotexist')
    ).rejects.toBeInstanceOf(AppError);
  });
});
