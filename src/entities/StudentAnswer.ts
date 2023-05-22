import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './Student';
import { Test } from './Test';
import { Question } from './Question';

@Index('student_answer_FK', ['studentId'], {})
@Index('student_answer_FK_1', ['testId'], {})
@Index('student_answer_FK_2', ['questionId'], {})
@Entity('student_answer', { schema: 'toeic_exam' })
export class StudentAnswer {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'student_id' })
  studentId: number;

  @Column('int', { name: 'test_id' })
  testId: number;

  @Column('int', { name: 'question_id' })
  questionId: number;

  @Column('varchar', { name: 'selected_answer', nullable: true, length: 2 })
  selectedAnswer: string | null;

  @ManyToOne(() => Student, (student) => student.studentAnswers, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Student;

  @ManyToOne(() => Test, (test) => test.studentAnswers, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'test_id', referencedColumnName: 'id' }])
  test: Test;

  @ManyToOne(() => Question, (question) => question.studentAnswers, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'question_id', referencedColumnName: 'id' }])
  question: Question;
}
