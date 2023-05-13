import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Student } from "./student.entity";

@Index("feedback_fk0", ["idStudent"], {})
@Entity("feedback", { schema: "toeic_exam" })
export class Feedback {
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

  @Column("int", { name: "rate" })
  rate: number;

  @ManyToOne(() => Student, (student) => student.feedbacks, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_student", referencedColumnName: "id" }])
  idStudent2: Student;
}
