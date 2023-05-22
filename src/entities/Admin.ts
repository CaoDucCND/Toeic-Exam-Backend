import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from './Blog';
import { Chat } from './Chat';

@Entity('admin', { schema: 'toeic_exam' })
export class Admin {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', nullable: true, length: 100 })
  email: string | null;

  @Column('text', { name: 'password', nullable: true })
  password: string | null;

  @OneToMany(() => Blog, (blog) => blog.idAdmin2)
  blogs: Blog[];

  @OneToMany(() => Chat, (chat) => chat.idAdmin2)
  chats: Chat[];
}
