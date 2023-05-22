import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './Question';

@Index('detail_answer_FK', ['questionId'], {})
@Entity('detail_answer', { schema: 'toeic_exam' })
export class DetailAnswer {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'explane', nullable: true })
  explane: string | null;

  @Column('int', { name: 'question_id', nullable: true })
  questionId: number | null;

  @OneToOne(() => Question, (question) => question.detailAnswer, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'question_id', referencedColumnName: 'id' }])
  question: Question;
}
