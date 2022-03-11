import AppError from '@src/Errors/AppError';
import FakeUrlsRepository from '@src/Repositories/Fakes/FakeUrlsRepository';
import FakeUsersRepository from '@src/Repositories/Fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import ShortenUrlService from './ShortenUrlService';

let shortenUrlService: ShortenUrlService;
let createUserService: CreateUserService;
let fakeUrlsRepository: FakeUrlsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('ShortenUrl', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    fakeUrlsRepository = new FakeUrlsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    shortenUrlService = new ShortenUrlService(
      fakeUrlsRepository,
      fakeUsersRepository
    );
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

  it('Should be able to shorten url (user-shortened url)', async () => {
    process.env.APP_SECRET = 'secret';
    process.env.APP_HOST = 'http://localhost:3000';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    await expect(
      shortenUrlService.execute('http://www.google.com', user.id)
    ).resolves.not.toThrow();
  });

  it('Should be able to shorten url (user-shortened url when it has already been created by other user or anonymously)', async () => {
    process.env.APP_SECRET = 'secret';
    process.env.APP_HOST = 'http://localhost:3000';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    const secondUser = await createUserService.execute(
      'John Doe',
      'johndoe@gmail.com',
      '123456'
    );

    await shortenUrlService.execute('http://www.google.com', secondUser.id);

    await expect(
      shortenUrlService.execute('http://www.google.com', user.id)
    ).resolves.not.toThrow();
  });

  it('Should be able to shorten url (url anonymous shortening)', async () => {
    process.env.APP_SECRET = 'secret';
    process.env.APP_HOST = 'http://localhost:3000';

    await expect(
      shortenUrlService.execute('http://www.google.com')
    ).resolves.not.toThrow();
  });

  it('Should not be able to shorten url (non valid url)', async () => {
    process.env.APP_SECRET = 'secret';
    process.env.APP_HOST = 'http://localhost:3000';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    await expect(
      shortenUrlService.execute('non-valid', user.id)
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to shorten url (url already exists)', async () => {
    process.env.APP_SECRET = 'secret';
    process.env.APP_HOST = 'http://localhost:3000';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    await shortenUrlService.execute('http://www.google.com', user.id);

    await expect(
      shortenUrlService.execute('http://www.google.com', user.id)
    ).resolves.not.toThrow();
  });

  it('Should not be able to shorten url (no app host)', async () => {
    process.env.APP_SECRET = 'secret';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    await expect(
      shortenUrlService.execute('http://www.google.com', user.id)
    ).rejects.toBeInstanceOf(AppError);
  });
});
