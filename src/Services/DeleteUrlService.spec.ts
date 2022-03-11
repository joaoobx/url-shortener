import AppError from '@src/Errors/AppError';
import FakeUrlsRepository from '@src/Repositories/Fakes/FakeUrlsRepository';
import FakeUsersRepository from '@src/Repositories/Fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import DeleteUrlService from './DeleteUrlService';
import ShortenUrlService from './ShortenUrlService';

let deleteUrlService: DeleteUrlService;
let shortenUrlService: ShortenUrlService;
let createUserService: CreateUserService;
let fakeUrlsRepository: FakeUrlsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('DeleteUrl', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    fakeUrlsRepository = new FakeUrlsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    deleteUrlService = new DeleteUrlService(fakeUrlsRepository);
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

  it('Should be able delete url', async () => {
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
      deleteUrlService.execute(url.id, user.id)
    ).resolves.not.toThrow();
  });

  it('Should not be able to delete url (non existent url)', async () => {
    process.env.APP_SECRET = 'secret';
    process.env.APP_HOST = 'http://localhost:3000';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    await expect(
      deleteUrlService.execute(9999999, user.id)
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to delete url (user trying to delete url which its not theirs', async () => {
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

    const url = await shortenUrlService.execute(
      'http://www.google.com',
      user.id
    );

    await expect(
      deleteUrlService.execute(url.id, secondUser.id)
    ).rejects.toBeInstanceOf(AppError);
  });
});
