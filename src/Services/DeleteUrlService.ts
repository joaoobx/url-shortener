import { inject, injectable } from 'tsyringe';
import AppError from '@src/Errors/AppError';
import IUrlsRepository from '@src/RepositoryInterfaces/IUrlsRepository';

@injectable()
export default class DeleteUrlService {
  constructor(
    @inject('UrlsRepository')
    private urlsRepository: IUrlsRepository
  ) {}

  public async execute(urlId: number, userId: number) {
    const findUrl = await this.urlsRepository.findById(urlId);

    if (!findUrl || !findUrl.userId) {
      throw new AppError('Não foi possível excluir a url');
    }

    if (findUrl.userId.id !== userId) {
      throw new AppError('Você não pode excluir esta url');
    }

    await this.urlsRepository.delete(findUrl);
  }
}
