import IUrlDTO from '@src/DTOs/IUrlDTO';
import Url from '@src/Entities/Url';
import AppError from '@src/Errors/AppError';
import IUrlsRepository from '@src/RepositoryInterfaces/IUrlsRepository';
import { getRepository, Repository, getManager } from 'typeorm';

class UrlsRepository implements IUrlsRepository {
  private ormRepository: Repository<Url>;

  constructor() {
    this.ormRepository = getRepository(Url);
  }

  public async create(urlData: IUrlDTO): Promise<Url> {
    const url = this.ormRepository.create(urlData);

    await this.ormRepository.save(url);

    return url;
  }

  public async save(url: Url): Promise<Url> {
    return this.ormRepository.save(url);
  }

  public async findById(id: number): Promise<Url | undefined> {
    const foundUrl = await this.ormRepository.findOne({
      where: { id },
    });

    return foundUrl;
  }

  public async findByUrl(originalUrl: string): Promise<Url | undefined> {
    const foundUrl = await this.ormRepository.findOne({
      where: { originalUrl },
    });

    return foundUrl;
  }

  public async findByUrlAndUserId(
    originalUrl: string,
    userId?: number
  ): Promise<Url | undefined> {
    if (!userId) {
      return undefined;
    }

    const foundUrl = await this.ormRepository.findOne({
      where: { originalUrl, userId },
    });

    return foundUrl;
  }

  public async findByUrlCode(urlCode: string): Promise<Url> {
    const entityManager = getManager();
    const foundUrlCode = await this.ormRepository.findOne({
      where: { urlCode },
    });

    if (!foundUrlCode) {
      throw new AppError('URL não encontrada');
    }

    foundUrlCode.views += 1;
    await entityManager.save(foundUrlCode);
    return foundUrlCode;
  }

  public async findTop100(): Promise<Url[]> {
    const top100 = await this.ormRepository.find({
      order: { views: 'DESC' },
      take: 100,
    });

    return top100;
  }

  public async findUserUrls(userId: number): Promise<Url[] | undefined> {
    const top100 = await this.ormRepository.find({
      where: { userId },
      order: { views: 'DESC' },
    });

    return top100;
  }

  public async delete(url: Url): Promise<void> {
    try {
      await this.ormRepository.delete(url);
    } catch {
      throw new AppError('Não foi possível excluir a url');
    }
  }
}

export default UrlsRepository;
