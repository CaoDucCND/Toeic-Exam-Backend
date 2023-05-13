import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Assets } from "./assets.entity";
import { OptionAnswer } from "./optionAnswer.entity";
import { PartQuestion } from "./partQuestion.entity";
import { Paragraph } from "./paragraph.entity";

@Index("question_fk0", ["partQuestionId"], {})
@Index("question_fk1", ["paragraphId"], {})
@Entity("question", { schema: "toeic_exam" })
export class Question {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "part_question_id" })
  partQuestionId: number;

  @Column("int", { name: "paragraph_id" })
  paragraphId: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("varchar", { name: "correct_answer", length: 255 })
  correctAnswer: string;

  @Column("varchar", { name: "selected_answer", nullable: true, length: 100 })
  selectedAnswer: string | null;

  @OneToMany(() => Assets, (assets) => assets.idQuestion2)
  assets: Assets[];

  @OneToMany(() => OptionAnswer, (optionAnswer) => optionAnswer.question)
  optionAnswers: OptionAnswer[];

  @ManyToOne(() => PartQuestion, (partQuestion) => partQuestion.questions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "part_question_id", referencedColumnName: "id" }])
  partQuestion: PartQuestion;

  @ManyToOne(() => Paragraph, (paragraph) => paragraph.questions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "paragraph_id", referencedColumnName: "id" }])
  paragraph: Paragraph;
}
