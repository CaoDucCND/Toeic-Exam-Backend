import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Test } from "./test.entity";
import { Exam } from "./exam.entity";

@Index("full_test_fk0", ["testId"], {})
@Index("full_test_fk1", ["examId"], {})
@Entity("full_test", { schema: "toeic_exam" })
export class FullTest {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "test_id" })
  testId: number;

  @Column("int", { name: "exam_id" })
  examId: number;

  @ManyToOne(() => Test, (test) => test.fullTests, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "test_id", referencedColumnName: "id" }])
  test: Test;

  @ManyToOne(() => Exam, (exam) => exam.fullTests, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "exam_id", referencedColumnName: "id" }])
  exam: Exam;
}
