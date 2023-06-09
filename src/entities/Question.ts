import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assets } from './Assets';
import { DetailAnswer } from './DetailAnswer';
import { OptionAnswer } from './OptionAnswer';
import { Paragraph } from './Paragraph';
import { PartQuestion } from './PartQuestion';
import { StudentAnswer } from './StudentAnswer';

@Index('question_fk1', ['paragraphId'], {})
@Index('question_fk0', ['partQuestionId'], {})
@Entity('question', { schema: 'toeic_exam' })
export class Question {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'part_question_id', nullable: true })
  partQuestionId: number | null;

  @Column('int', { name: 'paragraph_id', nullable: true })
  paragraphId: number | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('varchar', { name: 'correct_answer', length: 255 })
  correctAnswer: string;

  @Column('int', { name: 'num_question', nullable: true })
  numQuestion: number | null;

  @OneToMany(() => Assets, (assets) => assets.idQuestion2)
  assets: Assets[];

  @OneToOne(() => DetailAnswer, (detailAnswer) => detailAnswer.question)
  detailAnswer: DetailAnswer;

  @OneToMany(() => OptionAnswer, (optionAnswer) => optionAnswer.question)
  optionAnswers: OptionAnswer[];

  @ManyToOne(() => Paragraph, (paragraph) => paragraph.questions, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'paragraph_id', referencedColumnName: 'id' }])
  paragraph: Paragraph;

  @ManyToOne(() => PartQuestion, (partQuestion) => partQuestion.questions, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'part_question_id', referencedColumnName: 'id' }])
  partQuestion: PartQuestion;

  @OneToMany(() => StudentAnswer, (studentAnswer) => studentAnswer.question)
  studentAnswers: StudentAnswer[];
}
