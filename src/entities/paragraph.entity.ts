import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PartParagraph } from "./partParagraph.entity";
import { Question } from "./question.entity";

@Index("paragraph_fk0", ["partParagraphId"], {})
@Entity("paragraph", { schema: "toeic_exam" })
export class Paragraph {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "part_paragraph_id" })
  partParagraphId: number;

  @Column("text", { name: "content" })
  content: string;

  @ManyToOne(() => PartParagraph, (partParagraph) => partParagraph.paragraphs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "part_paragraph_id", referencedColumnName: "id" }])
  partParagraph: PartParagraph;

  @OneToMany(() => Question, (question) => question.paragraph)
  questions: Question[];
}
