import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Admin } from "./Admin";
import { Student } from "./Student";
import { ChatDetail } from "./ChatDetail";

@Index("chat_fk1", ["idAdmin"], {})
@Entity("chat", { schema: "toeic_exam" })
export class Chat {
  @Column("int", { primary: true, name: "id_student" })
  idStudent: number;

  @Column("int", { primary: true, name: "id_admin" })
  idAdmin: number;

  @ManyToOne(() => Admin, (admin) => admin.chats, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_admin", referencedColumnName: "id" }])
  idAdmin2: Admin;

  @ManyToOne(() => Student, (student) => student.chats, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_student", referencedColumnName: "id" }])
  idStudent2: Student;

  @OneToMany(() => ChatDetail, (chatDetail) => chatDetail.idChat2)
  chatDetails: ChatDetail[];
}
