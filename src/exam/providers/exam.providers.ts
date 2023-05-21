import { DataSource } from "typeorm";
import { Exam } from "../../entities/Exam";
import { Question } from "src/entities/Question";
import { Part } from "src/entities/Part";

export const ExamProviders = [
    {
        provide: 'EXAM_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Exam),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'PART_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Part),
        inject: ['DATA_SOURCE'],
    }
]