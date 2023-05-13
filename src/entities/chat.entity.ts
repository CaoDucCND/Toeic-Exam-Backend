import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Student } from "./student.entity";
import { Admin } from "./admin.entity";
import { ChatDetail } from "./chatDetail.entity";

@Index("chat_fk1", ["idAdmin"], {})
@Entity("chat", { schema: "toeic_exam" })
export class Chat {
  @Column("int", { primary: true, name: "id_student" })
  idStudent: number;

  @Column("int", { primary: true, name: "id_admin" })
  idAdmin: number;

  @ManyToOne(() => Student, (student) => student.chats, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_student", referencedColumnName: "id" }])
  idStudent2: Student;

  @ManyToOne(() => Admin, (admin) => admin.chats, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_admin", referencedColumnName: "id" }])
  idAdmin2: Admin;

  @OneToMany(() => ChatDetail, (chatDetail) => chatDetail.idChat2)
  chatDetails: ChatDetail[];
}
