import { DataSource } from "typeorm";
import { Exam } from "../../entities/Exam";
import { Part } from "src/entities/Part";
import { Question } from "src/entities/Question";
import { Assets } from "src/entities/Assets";
import { Paragraph } from "src/entities/Paragraph";
import { OptionAnswer } from "src/entities/OptionAnswer";
import { PartParagraph } from "src/entities/PartParagraph";
import { PartQuestion } from "src/entities/PartQuestion";
import { Blog } from "src/entities/Blog";

export const AdminProviders = [
    {
        provide: 'EXAM_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Exam),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'PART_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Part),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'PARTQUESTION_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(PartQuestion),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'PARTPARAGRAPH_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(PartParagraph),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'QUESTION_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Question),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'ASSET_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Assets),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'PARAGRAPH_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Paragraph),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'OPTION_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(OptionAnswer),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'BLOG_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Blog),
        inject: ['DATA_SOURCE'],
    }
]