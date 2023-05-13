import { DataSource } from "typeorm";
import { Exam } from "../../entities/exam.entity";

export const ExamProviders = [
    {
        provide: 'EXAM_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Exam),
        inject: ['DATA_SOURCE'],
    }
]