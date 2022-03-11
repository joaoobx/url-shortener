import User from '@src/Entities/User';

export default interface IUrlDTO {
  originalUrl: string;
  shortUrl: string;
  urlCode: string;
  views: number;
  userId: User | null;
}
