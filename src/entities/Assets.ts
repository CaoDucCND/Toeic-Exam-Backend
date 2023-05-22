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
import { Paragraph } from './Paragraph';

@Index('assets_fk0', ['idQuestion'], {})
@Entity('assets', { schema: 'toeic_exam' })
export class Assets {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'id_question' })
  idQuestion: number;

  @Column('int', { name: 'paragraph_id' })
  paragraphId: number;

  @Column('enum', { primary: true, name: 'type', enum: ['AUDIO', 'IMAGE'] })
  type: 'AUDIO' | 'IMAGE';

  @Column('text', { name: 'url' })
  url: string;

  @ManyToOne(() => Question, (question) => question.assets, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'id_question', referencedColumnName: 'id' }])
  idQuestion2: Question;

  @OneToOne(() => Paragraph, (paragraph) => paragraph.assets, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'paragraph_id', referencedColumnName: 'id' }])
  paragraph: Paragraph;
}
