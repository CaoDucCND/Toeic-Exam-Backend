import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Part } from "./Part";
import { Question } from "./Question";

@Index("part_question_fk0", ["partId"], {})
@Entity("part_question", { schema: "toeic_exam" })
export class PartQuestion {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "part_id" })
  partId: number;

  @ManyToOne(() => Part, (part) => part.partQuestions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "part_id", referencedColumnName: "id" }])
  part: Part;

  @OneToMany(() => Question, (question) => question.partQuestion)
  questions: Question[];
}
