import { inject, injectable } from 'tsyringe';
import AppError from '@src/Errors/AppError';
import IUrlsRepository from '@src/RepositoryInterfaces/IUrlsRepository';

@injectable()
export default class RedirectUrlService {
  constructor(
    @inject('UrlsRepository')
    private urlsRepository: IUrlsRepository
  ) {}

  public async execute(urlCode: string): Promise<string> {
    const findUrl = await this.urlsRepository.findByUrlCode(urlCode);

    if (!findUrl) {
      throw new AppError('URL não encontrada');
    }
    return findUrl.originalUrl;
  }
}
