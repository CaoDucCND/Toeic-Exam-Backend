import { Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as path from 'path';
import { Exam } from 'src/entities/Exam';
import { Part } from 'src/entities/Part';
import { Assets } from 'src/entities/Assets';
import { Paragraph } from 'src/entities/Paragraph';
import { PartQuestion } from 'src/entities/PartQuestion';
import { PartParagraph } from 'src/entities/PartParagraph';
import { Question } from 'src/entities/Question';
import { OptionAnswer } from 'src/entities/OptionAnswer';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { file } from 'googleapis/build/src/apis/file';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject('EXAM_REPOSITORY') private examRepository: Repository<Exam>,
    @Inject('PART_REPOSITORY') private partRepository: Repository<Part>,
    @Inject('PARTQUESTION_REPOSITORY') private partQuestionRepository: Repository<PartQuestion>,
    @Inject('PARTPARAGRAPH_REPOSITORY') private partParagraphRepository: Repository<PartParagraph>,
    @Inject('PARAGRAPH_REPOSITORY') private paragraphRepository: Repository<Paragraph>,
    @Inject('QUESTION_REPOSITORY') private questionRepository: Repository<Question>,
    @Inject('ASSET_REPOSITORY') private assetRepository: Repository<Assets>,
    @Inject('OPTION_REPOSITORY') private optionAnswerRepository: Repository<OptionAnswer>

  ) { }

  async uploadExam(body: any, files: any) {
    try {
      console.log("admin");
      console.log('body', body);
      console.log('fiels', files);
      if (!files.excel || !files.image || !files.audio) {
        return {
          statusCode: 401,
          message: 'unexpected file',
        }
      }
      // console.log('body', body);
      // return;
      const results: any[] = [];
      const exam = new Exam();
      exam.name = "ETS 2023 Test 1";
      exam.createAt = new Date();
      exam.updateAt = new Date();
      const savedExam = await this.examRepository.save(exam);
      // console.log('savedExam', savedExam);

      const listPart = [];
      const listPartParagraph = [];
      const listPartQuestion = [];

      for (let i = 0; i < 7; i++) {
        // console.log('i', i);
        const part = new Part();
        part.name = "Part " + (i + 1);
        part.examId = savedExam.id;
        if (i == 0 || i == 1 || i == 4) {
          part.typePart = "PART_QUESTION";
        }
        else {
          part.typePart = "PART_PARAGRAPH";
        }
        // console.log(part);
        const savedPart = await this.partRepository.save(part);
        // console.log("savedPart", savedPart);
        listPart.push(savedPart);
        if (i == 0 || i == 1 || i == 4) {
          const partQuestion = new PartQuestion();
          partQuestion.partId = savedPart.id;
          // console.log(partQuestion);
          const savedPartQuestion = await this.partQuestionRepository.save(partQuestion);
          listPartQuestion.push(savedPartQuestion);
        }
        else {
          const partParagraph = new PartParagraph();
          partParagraph.partId = savedPart.id;
          const savedPartParagraph = await this.partParagraphRepository.save(partParagraph);
          listPartParagraph.push(savedPartParagraph);
        }
      }
      console.log("path===", files.excel[0].path)
      // return { listPart, listPartParagraph, listPartQuestion };
      await new Promise((resolve, reject) => {
        fs.createReadStream(files.excel[0].path)
          .pipe(csvParser())
          .on('data', function (row) {
            results.push(row);
          })
          .on('end', function () {
            console.log('CSV file successfully processed');
            resolve(results);
          })
          .on('error', function (error) {
            reject(error);
          });
      });
      // console.log('results', results[0]);
      if (results.length > 0) {
        // const question: Question[] = [];
        let questionCounter = 0;
        let savedParagraph: any;
        const listQuestion: Question[] = [];
        const listParagraph: Paragraph[] = [];
        for (let i = 0; i < results.length; i++) {
          // for (let i = 0; i < 6; i++) {
          //Part1
          if (i < 6) {
            // console.log(results[i]);
            const question = new Question();
            question.partQuestionId = listPartQuestion[0].id;
            question.content = results[i].question;
            question.numQuestion = parseInt(results[i].numQuestion);
            question.correctAnswer = results[i].correctAnswer;
            listQuestion.push(question);
            // await this.questionRepository.save(question);
          }
          //Part2
          else if (i >= 6 && i < 31) {
            const question = new Question();
            question.partQuestionId = listPartQuestion[1].id;
            question.content = results[i].question;
            question.numQuestion = results[i].numQuestion;
            question.correctAnswer = results[i].correctAnswer;
            listQuestion.push(question);
            // await this.questionRepository.save(question);
          }
          //Part3
          else if (i >= 31 && i < 70) {
            if (questionCounter === 0) {
              console.log("listPartParagraph[0]", listPartParagraph[0]);
              const paragraph = new Paragraph();
              paragraph.content = results[i].paragraph;
              paragraph.partParagraphId = listPartParagraph[0].id;
              savedParagraph = await this.paragraphRepository.save(paragraph);
            }
            const question = new Question();
            question.paragraphId = savedParagraph.id;
            question.content = results[i].question;
            question.numQuestion = results[i].numQuestion;
            question.correctAnswer = results[i].correctAnswer;
            listQuestion.push(question);
            // await this.questionRepository.save(question);
            questionCounter++;
            if (questionCounter === 3 || i === 69) {
              questionCounter = 0;
            }
          }
          //Part4
          else if (i >= 70 && i < 100) {
            if (questionCounter === 0) {
              const paragraph = new Paragraph();
              paragraph.content = results[i].paragraph;
              paragraph.partParagraphId = listPartParagraph[1].id;
              savedParagraph = await this.paragraphRepository.save(paragraph);
            }
            const question = new Question();
            question.paragraphId = savedParagraph.id;
            question.content = results[i].question;
            question.numQuestion = results[i].numQuestion;
            question.correctAnswer = results[i].correctAnswer;
            listQuestion.push(question);
            // await this.questionRepository.save(question);
            questionCounter++;
            if (questionCounter === 3 || i === 99) {
              questionCounter = 0;
            }
          }
          //Part5
          else if (i >= 100 && i < 130) {
            const question = new Question();
            question.partQuestionId = listPartQuestion[2].id;
            question.content = results[i].question;
            question.numQuestion = results[i].numQuestion;
            question.correctAnswer = results[i].correctAnswer;
            listQuestion.push(question);
            // await this.questionRepository.save(question);
          }
          //Part6
          else if (i >= 130 && i < 146) {
            if (questionCounter === 0) {
              // console.log("listPartParagraph[0]", listPartParagraph[2]);
              const paragraph = new Paragraph();
              paragraph.content = results[i].paragraph;
              paragraph.partParagraphId = listPartParagraph[0].id;
              savedParagraph = await this.paragraphRepository.save(paragraph);
            }
            const question = new Question();
            question.paragraphId = savedParagraph.id;
            question.content = results[i].question;
            question.numQuestion = results[i].numQuestion;
            question.correctAnswer = results[i].correctAnswer;
            listQuestion.push(question);
            // await this.questionRepository.save(question);
            questionCounter++;
            if (questionCounter === 4 || i === 145) {
              questionCounter = 0;
            }
          }
          //Part7
          else if (i >= 146 && i < 150) {
            if (questionCounter === 0) {
              console.log("listPartParagraph[0]", listPartParagraph[3]);
              const paragraph = new Paragraph();
              paragraph.content = results[i].paragraph;
              paragraph.partParagraphId = listPartParagraph[0].id;
              savedParagraph = await this.paragraphRepository.save(paragraph);
            }
            const question = new Question();
            question.paragraphId = savedParagraph.id;
            question.content = results[i].question;
            question.numQuestion = results[i].numQuestion;
            question.correctAnswer = results[i].correctAnswer;
            listQuestion.push(question);
            // await this.questionRepository.save(question);
            questionCounter++;
            if (questionCounter === 2 || i === 149) {
              questionCounter = 0;
            }
          }
          else if (i >= 150 && i < 159) {
            if (questionCounter === 0) {
              // console.log("listPartParagraph[0]", listPartParagraph[3]);
              const paragraph = new Paragraph();
              paragraph.content = results[i].paragraph;
              paragraph.partParagraphId = listPartParagraph[0].id;
              savedParagraph = await this.paragraphRepository.save(paragraph);
            }
            const question = new Question();
            question.paragraphId = savedParagraph.id;
            question.content = results[i].question;
            question.numQuestion = results[i].numQuestion;
            question.correctAnswer = results[i].correctAnswer;
            listQuestion.push(question);
            // await this.questionRepository.save(question);
            questionCounter++;
            if (questionCounter === 3 || i === 158) {
              questionCounter = 0;
            }
          }
          else if (i >= 159 && i < 175) {
            if (questionCounter === 0) {
              // console.log("listPartParagraph[0]", listPartParagraph[3]);
              const paragraph = new Paragraph();
              paragraph.content = results[i].paragraph;
              paragraph.partParagraphId = listPartParagraph[0].id;
              savedParagraph = await this.paragraphRepository.save(paragraph);
            }
            const question = new Question();
            question.paragraphId = savedParagraph.id;
            question.content = results[i].question;
            question.numQuestion = results[i].numQuestion;
            question.correctAnswer = results[i].correctAnswer;
            listQuestion.push(question);
            // await this.questionRepository.save(question);
            questionCounter++;
            if (questionCounter === 4 || i === 174) {
              questionCounter = 0;
            }
          }
          else {
            if (questionCounter === 0) {
              // console.log("listPartParagraph[0]", listPartParagraph[3]);
              const paragraph = new Paragraph();
              paragraph.content = results[i].paragraph;
              paragraph.partParagraphId = listPartParagraph[0].id;
              savedParagraph = await this.paragraphRepository.save(paragraph);
            }
            const question = new Question();
            question.paragraphId = savedParagraph.id;
            question.content = results[i].question;
            question.numQuestion = results[i].numQuestion;
            question.correctAnswer = results[i].correctAnswer;
            listQuestion.push(question);
            // await this.questionRepository.save(question);
            questionCounter++;
            if (questionCounter === 5 || i === 199) {
              questionCounter = 0;
            }
          }
        }
        const listsavedQuestion = await Promise.all([this.questionRepository.save(listQuestion)]);
        // console.log("listsavedQuestion", listsavedQuestion);

        const listImage = files.image;
        const listAudio = files.audio;
        const listAsesst = [];
        const listOptionAnswer = [];
        for (let i = 0; i < listImage.length; i++) {
          // console.log(i);
          const asset = new Assets();
          // asset.name = listImage[i].filename;
          asset.type = "IMAGE";
          asset.url = this.configService.get('PROTOCOL') + "://" + this.configService.get('HOST') + "/" + this.configService.get('FOLDER') + "/" + listImage[i].filename;
          const num = parseInt(listImage[i].originalname.match(/\d+/)?.[0] || "", 10); // Lấy số từ tên file, ví dụ: image_num1 -> 1

          const question = listsavedQuestion[0].find((item) => item.numQuestion === num);
          if (question) {
            asset.idQuestion = question.id;
            listAsesst.push(asset);
            // await this.assetRepository.save(asset);
          }
          else {
            console.log("question not found");
          }
        }

        //audio

        const asset = new Assets();
        // asset.name = listImage[i].filename;
        asset.type = "AUDIO";
        asset.url = this.configService.get('PROTOCOL') + "://" + this.configService.get('HOST') + "/" + this.configService.get('FOLDER') + "/" + listAudio[0].filename;
        // asset.url = 'duc'
        const num = parseInt(listImage[0].originalname.match(/\d+/)?.[0] || "", 10); // Lấy số từ tên file, ví dụ: image_num1 -> 1

        const question = listsavedQuestion[0].find((item) => item.numQuestion === num);
        if (question) {
          asset.idQuestion = question.id;
          listAsesst.push(asset);
          // await this.assetRepository.save(asset);
        }
        else {
          console.log("question not found");
        }


        for (let i = 0; i < listsavedQuestion[0].length; i++) {
          const optionAnswerA = new OptionAnswer();
          optionAnswerA.value = 'A';
          optionAnswerA.content = results[i].option1;
          optionAnswerA.questionId = listsavedQuestion[0][i].id;

          const optionAnswerB = new OptionAnswer();
          optionAnswerB.value = 'B';
          optionAnswerB.content = results[i].option2;
          optionAnswerB.questionId = listsavedQuestion[0][i].id;

          const optionAnswerC = new OptionAnswer();
          optionAnswerC.value = 'C';
          optionAnswerC.content = results[i].option3;
          optionAnswerC.questionId = listsavedQuestion[0][i].id;

          listOptionAnswer.push(optionAnswerA);
          listOptionAnswer.push(optionAnswerB);
          listOptionAnswer.push(optionAnswerC);

          if (results[i].option4 != null) {
            const optionAnswerD = new OptionAnswer();
            optionAnswerD.value = 'D';
            optionAnswerD.content = results[i].option4;
            optionAnswerD.questionId = listsavedQuestion[0][i].id;
            listOptionAnswer.push(optionAnswerD);
          }
          console.log('i===', i);
        }

        Promise.all([this.assetRepository.save(listAsesst), this.optionAnswerRepository.save(listOptionAnswer)]);
      }

      return {
        statusCode: 200,
        message: 'Upload success',
      }
    }
    catch (e) {
      console.log(e);
      return {
        statusCode: 500,
        message: 'Upload fail',
      }
    }
  }

  async getStudent() {
    const students = await this.userService.findAll();
    
    const modifiedStudents = students.map(student => {
      const { password, ...rest } = student;
      return rest;
    });
  
    return {
      statusCode: 200,
      message: 'Get student success',
      data: modifiedStudents,
    };
  }

}