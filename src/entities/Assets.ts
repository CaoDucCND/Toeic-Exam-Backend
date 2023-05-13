import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./Question";

@Index("assets_fk0", ["idQuestion"], {})
@Entity("assets", { schema: "toeic_exam" })
export class Assets {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "id_question" })
  idQuestion: number;

  @Column("enum", { primary: true, name: "type", enum: ["AUDIO", "IMAGE"] })
  type: "AUDIO" | "IMAGE";

  @Column("text", { name: "url" })
  url: string;

  @ManyToOne(() => Question, (question) => question.assets, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_question", referencedColumnName: "id" }])
  idQuestion2: Question;
}
