import { inject, injectable } from 'tsyringe';
import IUrlsRepository from '@src/RepositoryInterfaces/IUrlsRepository';

@injectable()
export default class FindTopUrlService {
  constructor(
    @inject('UrlsRepository')
    private urlsRepository: IUrlsRepository
  ) {}

  public async execute() {
    const findList = await this.urlsRepository.findTop100();

    return findList;
  }
}
