import { container } from 'tsyringe';

import UsersRepository from '@src/Repositories/UsersRepository';
import IUsersRepository from '@src/RepositoryInterfaces/IUsersRepository';
import IUrlsRepository from '@src/RepositoryInterfaces/IUrlsRepository';
import UrlsRepository from '@src/Repositories/UrlsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<IUrlsRepository>('UrlsRepository', UrlsRepository);
