import { DataSource } from 'typeorm';
import { Student } from 'src/entities/Student';
import { StudentAnswer } from 'src/entities/StudentAnswer';
import { Test } from 'src/entities/Test';
import { FullTest } from 'src/entities/FullTest';
import { SkillTest } from 'src/entities/SkillTest';
export const TestProviders = [
  {
    provide: 'STUDENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Student),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'STUDENT_ANSWER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(StudentAnswer),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'TEST_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Test),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'FULL_TEST_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(FullTest),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'SKILL_TEST_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SkillTest),
    inject: ['DATA_SOURCE'],
  },
];
