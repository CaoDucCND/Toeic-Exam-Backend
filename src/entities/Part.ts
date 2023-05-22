import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exam } from './Exam';
import { PartParagraph } from './PartParagraph';
import { PartQuestion } from './PartQuestion';
import { SkillTest } from './SkillTest';

@Index('part_fk0', ['examId'], {})
@Entity('part', { schema: 'toeic_exam' })
export class Part {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'exam_id' })
  examId: number;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('enum', {
    name: 'type_part',
    nullable: true,
    enum: ['PART_PARAGRAPH', 'PART_QUESTION'],
  })
  typePart: 'PART_PARAGRAPH' | 'PART_QUESTION' | null;

  @Column('datetime', { name: 'create_at', nullable: true })
  createAt: Date | null;

  @Column('datetime', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Exam, (exam) => exam.parts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'exam_id', referencedColumnName: 'id' }])
  exam: Exam;

  @OneToMany(() => PartParagraph, (partParagraph) => partParagraph.part)
  partParagraphs: PartParagraph[];

  @OneToMany(() => PartQuestion, (partQuestion) => partQuestion.part)
  partQuestions: PartQuestion[];

  @OneToMany(() => SkillTest, (skillTest) => skillTest.part)
  skillTests: SkillTest[];
}
