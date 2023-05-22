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

@Index('ranking_fk1', ['studentId'], {})
@Index('ranking_fk0', ['testId'], {})
@Entity('ranking', { schema: 'toeic_exam' })
export class Ranking {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'test_id' })
  testId: number;

  @Column('int', { name: 'student_id' })
  studentId: number;

  @ManyToOne(() => Student, (student) => student.rankings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Student;

  @ManyToOne(() => Test, (test) => test.rankings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'test_id', referencedColumnName: 'id' }])
  test: Test;
}
