import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./Account";
import { Blog } from "./Blog";
import { Chat } from "./Chat";

@Index("admin_fk0", ["idAccount"], {})
@Entity("admin", { schema: "toeic_exam" })
export class Admin {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "id_account" })
  idAccount: number;

  @ManyToOne(() => Account, (account) => account.admins, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_account", referencedColumnName: "id" }])
  idAccount2: Account;

  @OneToMany(() => Blog, (blog) => blog.idAdmin2)
  blogs: Blog[];

  @OneToMany(() => Chat, (chat) => chat.idAdmin2)
  chats: Chat[];
}
