import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Test } from "./test.entity";
import { Part } from "./part.entity";

@Index("skill_test_fk0", ["testId"], {})
@Index("skill_test_fk1", ["partId"], {})
@Entity("skill_test", { schema: "toeic_exam" })
export class SkillTest {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "test_id" })
  testId: number;

  @Column("int", { name: "part_id" })
  partId: number;

  @ManyToOne(() => Test, (test) => test.skillTests, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "test_id", referencedColumnName: "id" }])
  test: Test;

  @ManyToOne(() => Part, (part) => part.skillTests, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "part_id", referencedColumnName: "id" }])
  part: Part;
}
