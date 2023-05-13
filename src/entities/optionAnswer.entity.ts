import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./question.entity";

@Index("option_answer_fk0", ["questionId"], {})
@Entity("option_answer", { schema: "toeic_exam" })
export class OptionAnswer {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "question_id" })
  questionId: number;

  @Column("varchar", { name: "value", length: 2 })
  value: string;

  @Column("text", { name: "content" })
  content: string;

  @ManyToOne(() => Question, (question) => question.optionAnswers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "question_id", referencedColumnName: "id" }])
  question: Question;
}
