import { Inject, Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from "../entities/Exam";
import { Repository } from 'typeorm';
import { PartParagraph } from 'src/entities/PartParagraph';
import { PartQuestion } from 'src/entities/PartQuestion';
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
  'partQuestionAsset.url', 'partQuestionAsset.type'
]

function formatPartName(partName) {
  return partName.replace(/part(\d+)/i, 'Part $1');
}
@Injectable()
export class ExamService {
  constructor(@Inject('EXAM_REPOSITORY') private examRepository: Repository<Exam>) { }


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
    // const queryBuilder = this.examRepository
    //   .createQueryBuilder('exam')
    //   .leftJoin('exam.parts', 'part')
    //   .leftJoin('part.paragraphs', 'paragraph')
    //   .leftJoin('paragraph.questions', 'question')
    //   .leftJoin('question.optionAnswers', 'optionAnswer')
    //   .select(['exam.*', 'paragraph.content', 'optionAnswer.value', 'optionAnswer.content'])
    //   .where('exam.id = :id', { id: 1 });


    const queryPart = await this.examRepository.createQueryBuilder('exam')
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

    // const queryPartQ = await this.examRepository.createQueryBuilder('exam')
    //   .leftJoinAndSelect('exam.parts', 'part')
    //   .leftJoinAndSelect('part.partQuestions', 'partQuestion')
    //   .leftJoinAndSelect('partQuestion.questions', 'question')
    //   .leftJoinAndSelect('question.optionAnswers', 'optionAnswer')
    //   .leftJoinAndSelect('question.assets', 'asset')
    //   .select(['exam.id', 'exam.name', 'exam.description', 'part.name', 'partQuestion.partId', 'question.id', 'question.correctAnswer', 'optionAnswer.value', 'optionAnswer.content', 'asset.url', 'asset.type'])
    //   .addSelect("optionAnswer.*")
    //   .where('exam.id = :id', { id })
    //   .where('part.typePart = :typePart', { typePart: 'PART_QUESTION' })
    //   .getOne();

    return queryPart;

    // const result = await queryBuilder.getRawOne();
    // return result ? result : [];
    // return this.examRepository.createQueryBuilder("exam")
    //   .select(["exam.id", "exam.description", "part.id", "part.name", "part.typePart", "part_question.id", "question.id", "question.content"])
    //   .innerJoin("exam.parts", "part", "part.type_part = :typePart", { typePart: "PART_PARAGRAPH" })
    //   .innerJoin("part.partQuestions", "pa rt_question")
    //   .innerJoin("part_question.questions", "question")
    //   .getMany();
    // return this.examRepository.findOne({ where: { id: 1 }, select: ['id', 'description'], relations: ['parts'] });
    // return this.examRepository.findOne({ where: { id }, relations: ['parts', 'parts.partParagraphs', 'parts.partQuestions']});
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
