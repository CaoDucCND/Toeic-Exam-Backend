import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FullTest } from './FullTest';
import { Ranking } from './Ranking';
import { SkillTest } from './SkillTest';
import { StudentAnswer } from './StudentAnswer';

@Entity('test', { schema: 'toeic_exam' })
export class Test {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'description', nullable: true, length: 200 })
  description: string | null;

  @Column('int', { name: 'name', nullable: true })
  name: number | null;

  @Column('datetime', { name: 'time_start', nullable: true })
  timeStart: Date | null;

  @Column('datetime', { name: 'time_end', nullable: true })
  timeEnd: Date | null;

  @Column('int', { name: 'score', nullable: true })
  score: number | null;

  @Column('enum', { name: 'type_of_test', enum: ['FULL_TEST', 'SKILL_TEST'] })
  typeOfTest: 'FULL_TEST' | 'SKILL_TEST';

  @OneToMany(() => FullTest, (fullTest) => fullTest.test)
  fullTests: FullTest[];

  @OneToMany(() => Ranking, (ranking) => ranking.test)
  rankings: Ranking[];

  @OneToMany(() => SkillTest, (skillTest) => skillTest.test)
  skillTests: SkillTest[];

  @OneToMany(() => StudentAnswer, (studentAnswer) => studentAnswer.test)
  studentAnswers: StudentAnswer[];
}
