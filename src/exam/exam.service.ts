import { Inject, Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from "../entities/exam.entity";
import { Repository } from 'typeorm';

@Injectable()
export class ExamService {
  constructor(@Inject('EXAM_REPOSITORY') private examRepository: Repository<Exam>) { }


  create(createExamDto: CreateExamDto) {
    return 'This action adds a new exam';
  }

  findAll(): Promise<any> {
    return this.examRepository.createQueryBuilder("exam")
      .select(["exam.id", "exam.description", "part.id", "part.name", "part.typePart", "part_question.id", "question.id", "question.content"])
      .innerJoin("exam.parts", "part", "part.type_part = :typePart", { typePart: "PART_QUESTION" })
      .innerJoin("part.partQuestions", "part_question")
      .innerJoin("part_question.questions", "question")
      .getMany();
    // return this.examRepository.findOne({ where: { id: 1 }, select: ['id', 'description'], relations: ['parts'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} exam`;
  }

  update(id: number, updateExamDto: UpdateExamDto) {
    return `This action updates a #${id} exam`;
  }

  remove(id: number) {
    return `This action removes a #${id} exam`;
  }
}
