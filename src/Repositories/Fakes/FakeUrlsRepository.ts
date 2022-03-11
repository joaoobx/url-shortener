import IUrlDTO from '@src/DTOs/IUrlDTO';
import Url from '@src/Entities/Url';
import AppError from '@src/Errors/AppError';
import IUrlsRepository from '@src/RepositoryInterfaces/IUrlsRepository';

class FakeUrlsRepository implements IUrlsRepository {
  private urls: Url[] = [];

  public async create(urlData: IUrlDTO): Promise<Url> {
    const url = new Url();

    Object.assign(url, { id: this.urls.length }, urlData);

    this.urls.push(url);

    return Promise.resolve(url);
  }

  public async save(url: Url): Promise<Url> {
    const findIndex = this.urls.findIndex(
      (requestedUrl: Url) => requestedUrl.id === url.id
    );

    this.urls[findIndex] = url;

    return Promise.resolve(url);
  }

  public async findById(id: number): Promise<Url | undefined> {
    const findCompany = this.urls.find(
      (requestedUrl: Url) => String(requestedUrl.id) === String(id)
    );

    return Promise.resolve(findCompany);
  }

  public async findByUrl(url: string): Promise<Url | undefined> {
    const findCompany = this.urls.find(
      (requestedUrl: Url) => String(requestedUrl.originalUrl) === String(url)
    );

    return Promise.resolve(findCompany);
  }

  public async findByUrlAndUserId(
    originalUrl: string,
    userId?: number
  ): Promise<Url | undefined> {
    if (!userId) {
      return undefined;
    }

    const login = this.urls.find(
      (url: Url) =>
        String(url.originalUrl) === String(originalUrl) &&
        String(url.userId) === String(userId)
    );

    return Promise.resolve(login);
  }

  public async findByUrlCode(urlCode: string): Promise<Url | undefined> {
    const findCompany = this.urls.find(
      (requestedUrl: Url) => String(requestedUrl.urlCode) === String(urlCode)
    );

    return Promise.resolve(findCompany);
  }

  public async findTop100(): Promise<Url[]> {
    const top100 = this.urls.slice(0, 99);
    return Promise.resolve(top100);
  }

  public async findUserUrls(userId: number): Promise<Url[] | undefined> {
    const urlArray: Url[] = [];

    const url = this.urls.filter((requestedUrl: Url) => {
      for (let i = 0; i < this.urls.length; i += 1) {
        if (String(requestedUrl.userId?.id) === String(userId)) {
          urlArray.push(requestedUrl);
        }
      }
      return urlArray;
    });

    return Promise.resolve(url || undefined);
  }

  public async delete(url: Url): Promise<void> {
    const findUrl = this.urls.find(
      (requestedUser: Url) => requestedUser === url
    );

    if (!findUrl) {
      throw new AppError('Url não encontrada!');
    }

    const id = this.urls.indexOf(findUrl);

    this.urls = this.urls.splice(id, 1);

    return Promise.resolve();
  }
}

export default FakeUrlsRepository;
