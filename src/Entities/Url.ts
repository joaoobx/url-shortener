import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';

@Entity('url')
class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUrl: string;

  @Column()
  shortUrl: string;

  @Column()
  urlCode: string;

  @Column()
  views: number;

  @ManyToOne(() => User, (user: User) => user.id, { eager: true })
  @JoinColumn({ name: 'userId' })
  userId: User | null;

  @CreateDateColumn()
  createdAt: Date;
}

export default Url;
