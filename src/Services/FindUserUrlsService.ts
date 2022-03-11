import { inject, injectable } from 'tsyringe';
import IUrlsRepository from '@src/RepositoryInterfaces/IUrlsRepository';

@injectable()
export default class FindUserUrlsService {
  constructor(
    @inject('UrlsRepository')
    private urlsRepository: IUrlsRepository
  ) {}

  public async execute(userId: number) {
    const findList = await this.urlsRepository.findUserUrls(userId);

    return findList;
  }
}
