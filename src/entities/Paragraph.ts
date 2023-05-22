import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PartParagraph } from "./PartParagraph";
import { Question } from "./Question";
import { Assets } from "./Assets";

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
  @OneToOne(() => Assets, (assets) => assets.paragraph)
  assets: Assets;
}
