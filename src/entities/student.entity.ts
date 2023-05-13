import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chat } from "./chat.entity";
import { Feedback } from "./feedback.entity";
import { Note } from "./note.entity";
import { Ranking } from "./ranking.entity";
import { Report } from "./report.entity";
import { Account } from "./account.entity";

@Index("student_fk0", ["idAccount"], {})
@Entity("student", { schema: "toeic_exam" })
export class Student {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "id_account" })
  idAccount: number;

  @Column("varchar", { name: "username", length: 255 })
  username: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "phone", nullable: true, length: 255 })
  phone: string | null;

  @Column("int", { name: "dob", nullable: true })
  dob: number | null;

  @OneToMany(() => Chat, (chat) => chat.idStudent2)
  chats: Chat[];

  @OneToMany(() => Feedback, (feedback) => feedback.idStudent2)
  feedbacks: Feedback[];

  @OneToMany(() => Note, (note) => note.idStudent2)
  notes: Note[];

  @OneToMany(() => Ranking, (ranking) => ranking.student)
  rankings: Ranking[];

  @OneToMany(() => Report, (report) => report.idStudent2)
  reports: Report[];

  @ManyToOne(() => Account, (account) => account.students, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_account", referencedColumnName: "id" }])
  idAccount2: Account;
}
