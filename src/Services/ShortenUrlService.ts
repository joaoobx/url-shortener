import { inject, injectable } from 'tsyringe';
import shortid from 'shortid';
import validurl from 'valid-url';
import Url from '@src/Entities/Url';
import AppError from '@src/Errors/AppError';
import IUrlsRepository from '@src/RepositoryInterfaces/IUrlsRepository';
import IUsersRepository from '@src/RepositoryInterfaces/IUsersRepository';

@injectable()
export default class ShortenUrlService {
  constructor(
    @inject('UrlsRepository')
    private urlsRepository: IUrlsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(originalUrl: string, userId?: number): Promise<Url> {
    if (!validurl.isUri(originalUrl)) {
      throw new AppError('Url inválida');
    }

    const findUrl = await this.urlsRepository.findByUrl(originalUrl);

    const foundUserUrl = await this.urlsRepository.findByUrlAndUserId(
      originalUrl,
      userId
    );

    if (findUrl && !userId) {
      return findUrl;
    }

    if (findUrl && userId && !foundUserUrl) {
      const foundUser = await this.usersRepository.findById(userId);

      const response = await this.urlsRepository.create({
        originalUrl,
        shortUrl: findUrl.shortUrl,
        urlCode: findUrl.urlCode,
        views: 0,
        userId: foundUser,
      });

      return response;
    }

    if (findUrl && userId && foundUserUrl) {
      return foundUserUrl;
    }

    const urlCode = shortid.generate();

    if (!process.env.APP_HOST) {
      throw new AppError('Please, configure the host');
    }

    const shortUrl = `${process.env.APP_HOST}/redirect/${urlCode}`;

    if (!validurl.isWebUri(shortUrl)) {
      throw new AppError('Não foi possível encurtar Url');
    }

    if (userId !== undefined) {
      const foundUser = await this.usersRepository.findById(userId);

      const response = await this.urlsRepository.create({
        originalUrl,
        shortUrl,
        urlCode,
        views: 0,
        userId: foundUser,
      });

      return response;
    }

    const response = await this.urlsRepository.create({
      originalUrl,
      shortUrl,
      urlCode,
      views: 0,
      userId: null,
    });

    return response;
  }
}
