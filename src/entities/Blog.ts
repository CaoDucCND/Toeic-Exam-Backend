import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Admin } from "./Admin";

@Index("blog_fk0", ["idAdmin"], {})
@Entity("blog", { schema: "toeic_exam" })
export class Blog {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "id_admin" })
  idAdmin: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "content" })
  content: string;

  @Column("datetime", { name: "create_at" })
  createAt: Date;

  @Column("int", { name: "updated_at" })
  updatedAt: number;

  @ManyToOne(() => Admin, (admin) => admin.blogs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_admin", referencedColumnName: "id" }])
  idAdmin2: Admin;
}
