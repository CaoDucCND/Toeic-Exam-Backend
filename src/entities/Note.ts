import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Student } from "./Student";

@Index("note_fk0", ["idStudent"], {})
@Entity("note", { schema: "toeic_exam" })
export class Note {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "id_student" })
  idStudent: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "content" })
  content: string;

  @Column("datetime", { name: "create_at" })
  createAt: Date;

  @Column("datetime", { name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Student, (student) => student.notes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_student", referencedColumnName: "id" }])
  idStudent2: Student;
}
