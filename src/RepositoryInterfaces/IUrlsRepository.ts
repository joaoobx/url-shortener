import IUrlDTO from '@src/DTOs/IUrlDTO';
import Url from '@src/Entities/Url';

export default interface IUrlsRepository {
  create(data: IUrlDTO): Promise<Url>;
  save(user: Url): Promise<Url>;
  findById(id: number): Promise<Url | undefined>;
  findByUrl(email: string): Promise<Url | undefined>;
  findByUrlAndUserId(
    originalUrl: string,
    userId?: number
  ): Promise<Url | undefined>;
  findByUrlCode(code: string): Promise<Url | undefined>;
  findTop100(): Promise<Url[]>;
  findUserUrls(userId: number): Promise<Url[] | undefined>;
  delete(url: Url): Promise<void>;
}
