import { DataSource } from "typeorm";
import { Exam } from "../../entities/Exam";

export const ExamProviders = [
    {
        provide: 'EXAM_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Exam),
        inject: ['DATA_SOURCE'],
    }
]