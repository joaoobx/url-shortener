import FakeUrlsRepository from '@src/Repositories/Fakes/FakeUrlsRepository';
import FakeUsersRepository from '@src/Repositories/Fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FindTopUrlService from './FindTopUrlService';
import ShortenUrlService from './ShortenUrlService';

let findTopUrlService: FindTopUrlService;
let shortenUrlService: ShortenUrlService;
let createUserService: CreateUserService;
let fakeUrlsRepository: FakeUrlsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('FindTopUrl', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    fakeUrlsRepository = new FakeUrlsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    findTopUrlService = new FindTopUrlService(fakeUrlsRepository);
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

  it('Should be able to list top 100 urls', async () => {
    process.env.APP_SECRET = 'secret';
    process.env.APP_HOST = 'http://localhost:3000';

    const user = await createUserService.execute(
      'Maria Doe',
      'mariadoe@gmail.com',
      '123456'
    );

    await shortenUrlService.execute('http://www.google.com', user.id);

    await expect(findTopUrlService.execute()).resolves.not.toThrow();
  });
});
