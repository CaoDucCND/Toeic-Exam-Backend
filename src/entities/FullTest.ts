import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exam } from './Exam';
import { Test } from './Test';

@Index('full_test_fk1', ['examId'], {})
@Index('full_test_fk0', ['testId'], {})
@Entity('full_test', { schema: 'toeic_exam' })
export class FullTest {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'test_id' })
  testId: number;

  @Column('int', { name: 'exam_id' })
  examId: number;

  @ManyToOne(() => Exam, (exam) => exam.fullTests, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'exam_id', referencedColumnName: 'id' }])
  exam: Exam;

  @ManyToOne(() => Test, (test) => test.fullTests, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'test_id', referencedColumnName: 'id' }])
  test: Test;
}
