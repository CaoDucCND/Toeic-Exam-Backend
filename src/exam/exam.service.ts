import { Inject, Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from "../entities/Exam";
import { Repository } from 'typeorm';
import { PartParagraph } from 'src/entities/PartParagraph';
import { PartQuestion } from 'src/entities/PartQuestion';


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
  'partQuestionAsset.url', 'partQuestionAsset.type'
]

function formatPartName(partName) {
  return partName.replace(/part(\d+)/i, 'Part $1');
}
@Injectable()
export class ExamService {
  constructor(@Inject('EXAM_REPOSITORY') private examRepository: Repository<Exam>
    // @Inject('TEST_REPOSITORY') private partParagraphRepository: Repository<PartParagraph>,
  ) { }


  create(createExamDto: CreateExamDto) {
    return 'This action adds a new exam';
  }

  async getListPartByName(name: string): Promise<any> {
    const nameFormated = formatPartName(name);
    const res = await this.examRepository
      .createQueryBuilder('exam')
      .innerJoin('exam.parts', 'part')
      .select(['exam.id', 'exam.name', 'exam.description', 'part.id', 'part.name'])
      .where('part.name = :name', { name: nameFormated })
      .getMany();

    const resFormated = res.flatMap(item =>
      item.parts.map(part => ({
        id: item.id,
        name: `${part.name} - ${item.name}`,
        description: item.description
      }))
    );
    return resFormated;
  }

  async getDetailAswerByExamId(id: number): Promise<any> {
    console.log("checkID", id);

    const resultStudent = await this.examRepository.createQueryBuilder('exam')
      .leftJoinAndSelect('exam.fullTests', 'fullTest')
      .leftJoinAndSelect('fullTest.test', 'test')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect('part.partParagraphs', 'partParagraph', 'part.typePart = :partParagraphType', { partParagraphType: 'PART_PARAGRAPH' })
      .leftJoinAndSelect('part.partQuestions', 'partQuestion', 'part.typePart = :partQuestionType', { partQuestionType: 'PART_QUESTION' })
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .leftJoinAndSelect('paragraphQuestion.studentAnswers',
        'paragraphQuestionStudentAnswer')
      .leftJoinAndSelect('partQuestionQuestion.studentAnswers', 'partQuestionStudentAnswer')

      .where('exam.id = :id', { id: id })
      .select(['exam.id',
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

    const partsInResult = resultStudent.parts;
    const cleanedDataPartsInResult = [];

    partsInResult.forEach(part => {
      part.partQuestions.forEach(partQuestion => {
        partQuestion.questions.forEach(question => {
          cleanedDataPartsInResult.push({
            number: question.numQuestion,
            result: question.studentAnswers[0]?.selectedAnswer || null
          });
        });
      });

      part.partParagraphs.forEach(paragraph => {
        paragraph.paragraphs.forEach(paragraphQuestion => {
          paragraphQuestion.questions.forEach(question => {
            cleanedDataPartsInResult.push({
              number: question.numQuestion,
              result: question.studentAnswers[0]?.selectedAnswer || null
            });
          });
        });
      });
    });


    const data = await this.examRepository.createQueryBuilder('exam')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect('part.partParagraphs', 'partParagraph', 'part.typePart = :partParagraphType', { partParagraphType: 'PART_PARAGRAPH' })
      .leftJoinAndSelect('part.partQuestions', 'partQuestion', 'part.typePart = :partQuestionType', { partQuestionType: 'PART_QUESTION' })
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .leftJoinAndSelect('paragraphQuestion.detailAnswer', 'paragraphDetailAnswer')
      .leftJoinAndSelect('partQuestionQuestion.detailAnswer', 'questionDetailAnswer')
      .select(['exam.id',
        'part.name',
        'partParagraph.partId',
        'partQuestion.partId',
        'paragraph.content',
        'paragraphQuestion.id',
        'paragraphQuestion.numQuestion',
        'partQuestionQuestion.numQuestion',
        'partQuestionQuestion.correctAnswer',
        'paragraphQuestion.correctAnswer',
        'paragraphDetailAnswer.explane',
        'questionDetailAnswer.explane'
      ])
      .where('exam.id = :id', { id: id })
      .getOne();
    const parts = data.parts;
    const cleanedDataResultDetail = [];

    parts.forEach(part => {
      part.partQuestions.forEach(partQuestion => {
        partQuestion.questions.forEach(question => {
          cleanedDataResultDetail.push({
            number: question.numQuestion,
            result: question.correctAnswer,
            transcript: question.detailAnswer?.explane || null
          });
        });
      });

      part.partParagraphs.forEach(paragraph => {
        paragraph.paragraphs.forEach(paragraphQuestion => {
          paragraphQuestion.questions.forEach(question => {
            cleanedDataResultDetail.push({
              number: question.numQuestion,
              result: question.correctAnswer,
              transcript: question.detailAnswer?.explane || null
            });
          });
        });
      });
    });

    return { cleanedDataResultDetail, cleanedDataPartsInResult };
  }
  async getPartById(name: string, id: number): Promise<any> {
    const nameFormated = formatPartName(name);
    const res = await this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect('part.partParagraphs', 'partParagraph', 'part.typePart = :partParagraphType', { partParagraphType: 'PART_PARAGRAPH' })
      .leftJoinAndSelect('part.partQuestions', 'partQuestion', 'part.typePart = :partQuestionType', { partQuestionType: 'PART_QUESTION' })
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .leftJoinAndSelect('paragraphQuestion.optionAnswers', 'paragraphOptionAnswer')
      .leftJoinAndSelect('partQuestionQuestion.optionAnswers', 'partQuestionOptionAnswer')
      .leftJoinAndSelect('paragraphQuestion.assets', 'paragraphAsset')
      .leftJoinAndSelect('partQuestionQuestion.assets', 'partQuestionAsset')
      // .select(['exam.id', 'exam.name', 'exam.description', 'part.id', 'part.name'])
      .select(columnSelect)
      .where('part.name = :name', { name: nameFormated })
      .andWhere('exam.id = :id', { id })
      .getMany();

    // const resFormated = res.flatMap(item =>
    //   item.parts.map(part => ({
    //     id: item.id,
    //     name: `${part.name} - ${item.name}`,
    //     description: item.description
    //   }))
    // );
    return res;
  }
  async findOne(id: number): Promise<any> {
    console.log("checkID", id);
    const data = await this.examRepository.createQueryBuilder('exam')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect('part.partParagraphs', 'partParagraph', 'part.typePart = :partParagraphType', { partParagraphType: 'PART_PARAGRAPH' })
      .leftJoinAndSelect('part.partQuestions', 'partQuestion', 'part.typePart = :partQuestionType', { partQuestionType: 'PART_QUESTION' })
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .leftJoinAndSelect('paragraphQuestion.optionAnswers', 'paragraphOptionAnswer')
      .leftJoinAndSelect('partQuestionQuestion.optionAnswers', 'partQuestionOptionAnswer')
      .leftJoinAndSelect('paragraphQuestion.assets', 'paragraphAsset')
      .leftJoinAndSelect('partQuestionQuestion.assets', 'partQuestionAsset')
      .select(columnSelect)
      .where('exam.id = :id', { id })
      .getOne();

    return data;

  }
  async getCorrectAnswer(id: number): Promise<any> {
    const data = await this.examRepository.createQueryBuilder('exam')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect('part.partParagraphs', 'partParagraph', 'part.typePart = :partParagraphType', { partParagraphType: 'PART_PARAGRAPH' })
      .leftJoinAndSelect('part.partQuestions', 'partQuestion', 'part.typePart = :partQuestionType', { partQuestionType: 'PART_QUESTION' })
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .select(['exam.id',
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
      .where('exam.id = :id', { id: 1 })
      .getOne();
    const parts = data.parts;
    const cleanedData = [];

    // Duyệt qua mảng ban đầu
    parts.forEach(part => {
      part.partQuestions.forEach(partQuestion => {
        partQuestion.questions.forEach(question => {
          cleanedData.push({
            numQuestion: question.numQuestion,
            correctAnswer: question.correctAnswer
          });
        });
      });

      part.partParagraphs.forEach(paragraph => {
        paragraph.paragraphs.forEach(paragraphQuestion => {
          paragraphQuestion.questions.forEach(question => {
            cleanedData.push({
              numQuestion: question.numQuestion,
              correctAnswer: question.correctAnswer
            });
          });
        });
      });
    });

    return cleanedData;
  }


  async getResultFullTestById(id: number): Promise<any> {
    const resultStudent = await this.examRepository.createQueryBuilder('exam')
      .leftJoinAndSelect('exam.fullTests', 'fullTest')
      .leftJoinAndSelect('fullTest.test', 'test')
      .leftJoinAndSelect('exam.parts', 'part')
      .leftJoinAndSelect('part.partParagraphs', 'partParagraph', 'part.typePart = :partParagraphType', { partParagraphType: 'PART_PARAGRAPH' })
      .leftJoinAndSelect('part.partQuestions', 'partQuestion', 'part.typePart = :partQuestionType', { partQuestionType: 'PART_QUESTION' })
      .leftJoinAndSelect('partParagraph.paragraphs', 'paragraph')
      .leftJoinAndSelect('paragraph.questions', 'paragraphQuestion')
      .leftJoinAndSelect('partQuestion.questions', 'partQuestionQuestion')
      .leftJoinAndSelect('paragraphQuestion.studentAnswers',
        'paragraphQuestionStudentAnswer')
      .leftJoinAndSelect('partQuestionQuestion.studentAnswers', 'partQuestionStudentAnswer')

      .where('exam.id = :id', { id: id })
      .select(['exam.id',
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

    const partsInResult = resultStudent.parts;
    const dataResult = {
      type: resultStudent.fullTests[0].test.typeOfTest,
      idTest: resultStudent.fullTests[0].test.id,
      timeStart: resultStudent.fullTests[0].test.timeStart,
      timeEnd: resultStudent.fullTests[0].test.timeEnd,
      userResult: []
    }
    // const 

    partsInResult.forEach(part => {
      part.partQuestions.forEach(partQuestion => {
        partQuestion.questions.forEach(question => {
          dataResult.userResult.push({
            number: question.numQuestion,
            result: question.studentAnswers[0]?.selectedAnswer || null
          });
        });
      });

      part.partParagraphs.forEach(paragraph => {
        paragraph.paragraphs.forEach(paragraphQuestion => {
          paragraphQuestion.questions.forEach(question => {
            dataResult.userResult.push({
              number: question.numQuestion,
              result: question.studentAnswers[0]?.selectedAnswer || null
            });
          });
        });
      });
    });

    return dataResult;
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
