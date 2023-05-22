import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from '../entities/Exam';
import { Repository } from 'typeorm';
import { PartParagraph } from 'src/entities/PartParagraph';
import { PartQuestion } from 'src/entities/PartQuestion';
import { Question } from 'src/entities/Question';
import { Part } from 'src/entities/Part';
import { async } from 'rxjs';

interface ExamWithPartName {
  parts: {
    id: number;
    name: string;
    partParagraphs: PartParagraph[];
    partQuestions: PartQuestion[];
  }[];
}

const columnSelect = [
  'exam.id',
  'exam.name',
  'exam.description',
  'part.name',
  'partParagraph.partId',
  'partQuestion.partId',
  'paragraph.content',
  'paragraphQuestion.id',
  'paragraphQuestion.numQuestion',
  'partQuestionQuestion.numQuestion',
  'paragraphQuestion.content',
  'partQuestionQuestion.content',
  'paragraphQuestion.correctAnswer',
  'paragraphOptionAnswer.id',
  'paragraphOptionAnswer.value',
  'paragraphOptionAnswer.content',
  'paragraphAsset.url',
  'paragraphAsset.type',
  'partQuestionQuestion.id',
  'partQuestionQuestion.correctAnswer',
  'partQuestionOptionAnswer.id',
  'partQuestionOptionAnswer.value',
  'partQuestionOptionAnswer.content',
  'partQuestionAsset.url',
  'partQuestionAsset.type',
];

function formatPartName(partName) {
  return partName.replace(/part(\d+)/i, 'Part $1');
}
@Injectable()
export class ExamService {
  constructor(
    @Inject('EXAM_REPOSITORY') private examRepository: Repository<Exam>,
    @Inject('PART_REPOSITORY') private partRepository: Repository<Part>,
  ) {}

  create(createExamDto: CreateExamDto) {
    return 'This action adds a new exam';
  }

  async getListPartByName(name: string): Promise<any> {
    const nameFormated = formatPartName(name);
    const res = await this.examRepository
      .createQueryBuilder('exam')
      .innerJoin('exam.parts', 'part')
      .select([
        'exam.id',
        'exam.name',
        'exam.description',
        'part.id',
        'part.name',
      ])
      .where('part.name = :name', { name: nameFormated })
      .getMany();

    const resFormated = res.flatMap((item) =>
      item.parts.map((part) => ({
        id: item.id,
        name: `${part.name} - ${item.name}`,
        description: item.description,
      })),
    );
    return resFormated;
  }

  async getDetailAswerByExamId(id: number): Promise<any> {
    console.log('checkID', id);

    const resultStudent = await this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.fullTests', 'fullTest')
      .leftJoinAndSelect('fullTest.test', 'test')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect(
        'part.partParagraphs',
        'partParagraph',
        'part.typePart = :partParagraphType',
        { partParagraphType: 'PART_PARAGRAPH' },
      )
      .leftJoinAndSelect(
        'part.partQuestions',
        'partQuestion',
        'part.typePart = :partQuestionType',
        { partQuestionType: 'PART_QUESTION' },
      )
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .leftJoinAndSelect(
        'paragraphQuestion.studentAnswers',
        'paragraphQuestionStudentAnswer',
      )
      .leftJoinAndSelect(
        'partQuestionQuestion.studentAnswers',
        'partQuestionStudentAnswer',
      )

      .where('exam.id = :id', { id: id })
      .getOne();

    // const partsInResult = resultStudent.parts;
    // const cleanedDataPartsInResult = [];

    // partsInResult.forEach(part => {
    //   part.partQuestions.forEach(partQuestion => {
    //     partQuestion.questions.forEach(question => {
    //       cleanedDataPartsInResult.push({
    //         number: question.numQuestion,
    //         result: question.studentAnswers[0]?.selectedAnswer || null
    //       });
    //     });
    //   });

    //   part.partParagraphs.forEach(paragraph => {
    //     paragraph.paragraphs.forEach(paragraphQuestion => {
    //       paragraphQuestion.questions.forEach(question => {
    //         cleanedDataPartsInResult.push({
    //           number: question.numQuestion,
    //           result: question.studentAnswers[0]?.selectedAnswer || null
    //         });
    //       });
    //     });
    //   });
    // });

    // const data = await this.examRepository.createQueryBuilder('exam')
    //   .leftJoinAndSelect('exam.parts', 'part')
    //   .leftJoinAndSelect('part.partParagraphs', 'partParagraph', 'part.typePart = :partParagraphType', { partParagraphType: 'PART_PARAGRAPH' })
    //   .leftJoinAndSelect('part.partQuestions', 'partQuestion', 'part.typePart = :partQuestionType', { partQuestionType: 'PART_QUESTION' })
    //   .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
    //   .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
    //   .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
    //   .leftJoinAndSelect('paragraphQuestion.detailAnswer', 'paragraphDetailAnswer')
    //   .leftJoinAndSelect('partQuestionQuestion.detailAnswer', 'questionDetailAnswer')
    //   .select(['exam.id',
    //     'part.name',
    //     'partParagraph.partId',
    //     'partQuestion.partId',
    //     'paragraph.content',
    //     'paragraphQuestion.id',
    //     'paragraphQuestion.numQuestion',
    //     'partQuestionQuestion.numQuestion',
    //     'partQuestionQuestion.correctAnswer',
    //     'paragraphQuestion.correctAnswer',
    //     'paragraphDetailAnswer.explane',
    //     'questionDetailAnswer.explane'
    //   ])
    //   .where('exam.id = :id', { id: id })
    //   .getOne();
    // const parts = data.parts;
    // const cleanedDataResultDetail = [];

    // parts.forEach(part => {
    //   part.partQuestions.forEach(partQuestion => {
    //     partQuestion.questions.forEach(question => {
    //       cleanedDataResultDetail.push({
    //         number: question.numQuestion,
    //         result: question.correctAnswer,
    //         transcript: question.detailAnswer?.explane || null
    //       });
    //     });
    //   });

    //   part.partParagraphs.forEach(paragraph => {
    //     paragraph.paragraphs.forEach(paragraphQuestion => {
    //       paragraphQuestion.questions.forEach(question => {
    //         cleanedDataResultDetail.push({
    //           number: question.numQuestion,
    //           result: question.correctAnswer,
    //           transcript: question.detailAnswer?.explane || null
    //         });
    //       });
    //     });
    //   });
    // });

    // return { cleanedDataResultDetail, cleanedDataPartsInResult };
  }

  async getPartById(name: string, id: number): Promise<any> {
    const nameFormated = formatPartName(name);
    const columnSelectAdvance = [
      ...columnSelect,
      'part.id',
      'paragraphAsset2.type',
      'paragraphAsset2.url',
    ];
    const res = await this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect(
        'part.partParagraphs',
        'partParagraph',
        'part.typePart = :partParagraphType',
        { partParagraphType: 'PART_PARAGRAPH' },
      )
      .leftJoinAndSelect(
        'part.partQuestions',
        'partQuestion',
        'part.typePart = :partQuestionType',
        { partQuestionType: 'PART_QUESTION' },
      )
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .leftJoinAndSelect(
        'paragraphQuestion.optionAnswers',
        'paragraphOptionAnswer',
      )
      .leftJoinAndSelect(
        'partQuestionQuestion.optionAnswers',
        'partQuestionOptionAnswer',
      )
      .leftJoinAndSelect('paragraphQuestion.assets', 'paragraphAsset')
      .leftJoinAndSelect('partQuestionQuestion.assets', 'partQuestionAsset')
      .leftJoinAndSelect('paragraph.assets', 'paragraphAsset2')
      // .select(['exam.id', 'exam.name', 'exam.description', 'part.id', 'part.name'])
      .select(columnSelectAdvance)
      .where('part.name = :name', { name: nameFormated })
      .andWhere('exam.id = :id', { id })
      .getMany();
    return res;
  }
  async findOne(id: number): Promise<any> {
    console.log('checkID', id);
    const data = await this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect(
        'part.partParagraphs',
        'partParagraph',
        'part.typePart = :partParagraphType',
        { partParagraphType: 'PART_PARAGRAPH' },
      )
      .leftJoinAndSelect(
        'part.partQuestions',
        'partQuestion',
        'part.typePart = :partQuestionType',
        { partQuestionType: 'PART_QUESTION' },
      )
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .leftJoinAndSelect(
        'paragraphQuestion.optionAnswers',
        'paragraphOptionAnswer',
      )
      .leftJoinAndSelect(
        'partQuestionQuestion.optionAnswers',
        'partQuestionOptionAnswer',
      )
      .leftJoinAndSelect('paragraphQuestion.assets', 'paragraphAsset')
      .leftJoinAndSelect('partQuestionQuestion.assets', 'partQuestionAsset')
      .select(columnSelect)
      .where('exam.id = :id', { id })
      .getOne();

    return data;
  }
  async getCorrectAnswer(id: number): Promise<any> {
    const data = await this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect(
        'part.partParagraphs',
        'partParagraph',
        'part.typePart = :partParagraphType',
        { partParagraphType: 'PART_PARAGRAPH' },
      )
      .leftJoinAndSelect(
        'part.partQuestions',
        'partQuestion',
        'part.typePart = :partQuestionType',
        { partQuestionType: 'PART_QUESTION' },
      )
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .select([
        'exam.id',
        'part.name',
        'partParagraph.partId',
        'partQuestion.partId',
        'paragraph.content',
        'paragraphQuestion.id',
        'paragraphQuestion.numQuestion',
        'partQuestionQuestion.numQuestion',
        'partQuestionQuestion.correctAnswer',
        'paragraphQuestion.correctAnswer',
      ])
      .where('exam.id = :id', { id: id })
      .getOne();
    const parts = data.parts;
    const cleanedData = [];

    // Duyệt qua mảng ban đầu
    parts.forEach((part) => {
      part.partQuestions.forEach((partQuestion) => {
        partQuestion.questions.forEach((question) => {
          cleanedData.push({
            numQuestion: question.numQuestion,
            correctAnswer: question.correctAnswer,
          });
        });
      });

      part.partParagraphs.forEach((paragraph) => {
        paragraph.paragraphs.forEach((paragraphQuestion) => {
          paragraphQuestion.questions.forEach((question) => {
            cleanedData.push({
              numQuestion: question.numQuestion,
              correctAnswer: question.correctAnswer,
            });
          });
        });
      });
    });

    return cleanedData;
  }

  async getQuestionsByExamId(id: number): Promise<any> {
    const data = await this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect(
        'part.partParagraphs',
        'partParagraph',
        'part.typePart = :partParagraphType',
        { partParagraphType: 'PART_PARAGRAPH' },
      )
      .leftJoinAndSelect(
        'part.partQuestions',
        'partQuestion',
        'part.typePart = :partQuestionType',
        { partQuestionType: 'PART_QUESTION' },
      )
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .select([
        'exam.id',
        'part.name',
        'partParagraph.partId',
        'partQuestion.partId',
        'paragraph.content',
        'paragraphQuestion.id',
        'partQuestionQuestion.paragraphId',
        'paragraphQuestion.numQuestion',
        'paragraphQuestion.content',
        'paragraphQuestion.correctAnswer',
        'partQuestionQuestion.id',
        'partQuestionQuestion.partQuestionId',
        'partQuestionQuestion.numQuestion',
        'partQuestionQuestion.content',
        'partQuestionQuestion.correctAnswer',
      ])
      .where('exam.id = :id', { id: id })
      .getOne();

    const parts = data.parts;
    const cleanedData = [];
    parts.forEach((part) => {
      // Duyệt qua mảng ban đầu
      part.partQuestions.forEach((partQuestion) => {
        partQuestion.questions.forEach((question) => {
          cleanedData.push({
            questionId: question.id,
            partQuestionId: question.partQuestionId,
            content: question.content,
            numQuestion: question.numQuestion,
            correctAnswer: question.correctAnswer,
          });
        });
      });

      part.partParagraphs.forEach((paragraph) => {
        paragraph.paragraphs.forEach((paragraphQuestion) => {
          paragraphQuestion.questions.forEach((question) => {
            cleanedData.push({
              questionId: question.id,
              partParagraphId: question.paragraphId,
              content: question.content,
              numQuestion: question.numQuestion,
              correctAnswer: question.correctAnswer,
            });
          });
        });
      });
    });
    return cleanedData;
  }

  async getQuestionByExamIdAndNum(
    id: number,
    numQuestion: number,
    type: string,
  ): Promise<any> {
    let condition = '';
    if (type === 'FULL_TEST') {
      condition = 'exam.id = :id';
    }
    if (type === 'SKILL_TEST') {
      condition = 'part.id = :id';
    }
    const data = await this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect(
        'part.partParagraphs',
        'partParagraph',
        'part.typePart = :partParagraphType',
        { partParagraphType: 'PART_PARAGRAPH' },
      )
      .leftJoinAndSelect(
        'part.partQuestions',
        'partQuestion',
        'part.typePart = :partQuestionType',
        { partQuestionType: 'PART_QUESTION' },
      )
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .select([
        'exam.id',
        'part.name',
        'partParagraph.partId',
        'partQuestion.partId',
        'paragraph.content',
        'paragraphQuestion.id',
        'partQuestionQuestion.paragraphId',
        'paragraphQuestion.numQuestion',
        'paragraphQuestion.content',
        'paragraphQuestion.correctAnswer',
        'partQuestionQuestion.id',
        'partQuestionQuestion.partQuestionId',
        'partQuestionQuestion.numQuestion',
        'partQuestionQuestion.content',
        'partQuestionQuestion.correctAnswer',
      ])
      .where(condition, { id: id })
      .andWhere(
        '(paragraphQuestion.numQuestion = :numQuestion OR partQuestionQuestion.numQuestion = :numQuestion)',
        { numQuestion: numQuestion },
      )
      .getOne();
    // return data.parts
    const parts = data.parts;
    const cleanedData = [];
    parts.forEach((part) => {
      // Duyệt qua mảng ban đầu
      part.partQuestions.forEach((partQuestion) => {
        partQuestion.questions.forEach((question) => {
          cleanedData.push({
            questionId: question.id,
            partQuestionId: question.partQuestionId,
            content: question.content,
            numQuestion: question.numQuestion,
            correctAnswer: question.correctAnswer,
          });
        });
      });

      part.partParagraphs.forEach((paragraph) => {
        paragraph.paragraphs.forEach((paragraphQuestion) => {
          paragraphQuestion.questions.forEach((question) => {
            cleanedData.push({
              questionId: question.id,
              partParagraphId: question.paragraphId,
              content: question.content,
              numQuestion: question.numQuestion,
              correctAnswer: question.correctAnswer,
            });
          });
        });
      });
    });
    return cleanedData;
  }

  async getNumberOfQuestionByPartId(id: number): Promise<any> {
    const countQuery = await this.partRepository
      .createQueryBuilder('part')
      .leftJoinAndSelect(
        'part.partParagraphs',
        'partParagraph',
        'part.typePart = :partParagraphType',
        { partParagraphType: 'PART_PARAGRAPH' },
      )
      .leftJoinAndSelect(
        'part.partQuestions',
        'partQuestion',
        'part.typePart = :partQuestionType',
        { partQuestionType: 'PART_QUESTION' },
      )
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .where('part.id = :id', { id })
      .select(
        'COUNT(DISTINCT paragraphQuestion.id) + COUNT(DISTINCT partQuestionQuestion.id)',
        'questionCount',
      )
      .getRawOne();

    const questionCount = countQuery ? countQuery.questionCount : 0;
    return questionCount;
  }

  async getDetailAnserByPartId(id: number): Promise<any> {}

  async getResultFullTestById(id: number): Promise<any> {
    const resultStudent = await this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.fullTests', 'fullTest')
      .leftJoinAndSelect('fullTest.test', 'test')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect(
        'part.partParagraphs',
        'partParagraph',
        'part.typePart = :partParagraphType',
        { partParagraphType: 'PART_PARAGRAPH' },
      )
      .leftJoinAndSelect(
        'part.partQuestions',
        'partQuestion',
        'part.typePart = :partQuestionType',
        { partQuestionType: 'PART_QUESTION' },
      )
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .leftJoinAndSelect(
        'paragraphQuestion.studentAnswers',
        'paragraphQuestionStudentAnswer',
      )
      .leftJoinAndSelect(
        'partQuestionQuestion.studentAnswers',
        'partQuestionStudentAnswer',
      )
      .where('exam.id = :id', { id: id })
      .select([
        'exam.id',
        'exam.name',
        'fullTest.id',
        'test.id',
        'test.typeOfTest',
        'test.timeStart',
        'test.timeEnd',
        'part.name',
        'partParagraph.partId',
        'partQuestion.partId',
        'paragraph.content',
        'paragraphQuestion.id',
        'paragraphQuestion.numQuestion',
        'partQuestionQuestion.numQuestion',
        'paragraphQuestionStudentAnswer.selectedAnswer',
        'partQuestionStudentAnswer.selectedAnswer',
      ])
      .getOne();

    if (!resultStudent.fullTests.length) {
      throw new NotFoundException('Not found result');
    }

    const partsInResult = resultStudent.parts;
    const dataResult = {
      name: resultStudent.name || null,
      type: resultStudent.fullTests[0].test.typeOfTest || null,
      idTest: resultStudent.fullTests[0].test.id || null,
      timeStart: resultStudent.fullTests[0].test.timeStart || null,
      timeEnd: resultStudent.fullTests[0].test.timeEnd || null,
      userResult: [],
    };

    partsInResult.forEach((part) => {
      part.partQuestions.forEach((partQuestion) => {
        partQuestion.questions.forEach((question) => {
          dataResult.userResult.push({
            number: question.numQuestion,
            result: question.studentAnswers[0]?.selectedAnswer || null,
          });
        });
      });

      part.partParagraphs.forEach((paragraph) => {
        paragraph.paragraphs.forEach((paragraphQuestion) => {
          paragraphQuestion.questions.forEach((question) => {
            dataResult.userResult.push({
              number: question.numQuestion,
              result: question.studentAnswers[0]?.selectedAnswer || null,
            });
          });
        });
      });
    });

    return dataResult;
  }

  async getResultSkillTestById(id: number): Promise<any> {
    const resultStudent = await this.partRepository
      .createQueryBuilder('part')
      .leftJoinAndSelect(
        'part.partParagraphs',
        'partParagraph',
        'part.typePart = :partParagraphType',
        { partParagraphType: 'PART_PARAGRAPH' },
      )
      .leftJoinAndSelect(
        'part.partQuestions',
        'partQuestion',
        'part.typePart = :partQuestionType',
        { partQuestionType: 'PART_QUESTION' },
      )
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .leftJoinAndSelect(
        'paragraphQuestion.studentAnswers',
        'paragraphQuestionStudentAnswer',
      )
      .leftJoinAndSelect(
        'partQuestionQuestion.studentAnswers',
        'partQuestionStudentAnswer',
      )
      .leftJoinAndSelect(
        'part.skillTests',
        'skillTest',
        'skillTest.partId = part.id',
      )
      .leftJoinAndSelect('skillTest.test', 'test')
      .where('part.id = :id', { id: id })
      // .select([

      //   'fullTest.id',
      //   'test.id',
      //   'test.typeOfTest',
      //   'test.timeStart',
      //   'test.timeEnd',
      //   'part.name',
      //   'partParagraph.partId',
      //   'partQuestion.partId',
      //   'paragraph.content',
      //   'paragraphQuestion.id',
      //   'paragraphQuestion.numQuestion',
      //   'partQuestionQuestion.numQuestion',
      //   'paragraphQuestionStudentAnswer.selectedAnswer',
      //   'partQuestionStudentAnswer.selectedAnswer',
      // ])
      .getOne();
    return resultStudent;
  }

  async findAll(): Promise<Exam[]> {
    return this.examRepository.find();
  }

  update(id: number, updateExamDto: UpdateExamDto) {
    return `This action updates a #${id} exam`;
  }

  remove(id: number) {
    return `This action removes a #${id} exam`;
  }
}
