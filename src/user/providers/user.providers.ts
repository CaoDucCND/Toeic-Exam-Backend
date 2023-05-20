import { DataSource } from 'typeorm';
import { Student } from 'src/entities/Student';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Student),
    inject: ['DATA_SOURCE'],
  },
];
