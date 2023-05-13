import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Paragraph } from "./paragraph.entity";
import { Part } from "./part.entity";

@Index("part_paragraph_fk0", ["partId"], {})
@Entity("part_paragraph", { schema: "toeic_exam" })
export class PartParagraph {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "part_id" })
  partId: number;

  @OneToMany(() => Paragraph, (paragraph) => paragraph.partParagraph)
  paragraphs: Paragraph[];

  @ManyToOne(() => Part, (part) => part.partParagraphs, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "part_id", referencedColumnName: "id" }])
  part: Part;
}
