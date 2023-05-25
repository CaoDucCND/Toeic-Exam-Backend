import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExamService } from 'src/exam/exam.service';
import { StudentAnswer } from 'src/entities/StudentAnswer';
import { Test } from 'src/entities/Test';
import { Repository } from 'typeorm';
import { Student } from 'src/entities/Student';
import { FullTest } from 'src/entities/FullTest';
import { Exam } from 'src/entities/Exam';
import { async } from 'rxjs';
import { SkillTest } from 'src/entities/SkillTest';

@Injectable()
export class ToeicTestService {
  constructor(
    private examService: ExamService,
    @Inject('STUDENT_REPOSITORY')
    private studentRepository: Repository<Student>,
    @Inject('STUDENT_ANSWER_REPOSITORY')
    private studentAnswerRepository: Repository<StudentAnswer>,
    @Inject('TEST_REPOSITORY') private testRepository: Repository<Test>,
    @Inject('FULL_TEST_REPOSITORY')
    private fullTestRepository: Repository<FullTest>,
    @Inject('SKILL_TEST_REPOSITORY')
    private skillTestRepository: Repository<SkillTest>,
  ) { }

  async getFullTest(): Promise<any> {
    const listExam = await this.examService.findAll();
    return {
      statusCode: 200,
      message: 'Get full test successfully',
      data: listExam ? listExam : [],
    };
  }

  async getFullTestById(id: number): Promise<any> {
    const exam = await this.examService.findOne(id);

    return {
      statusCode: 200,
      message: 'Get test by id successfully',
      data: exam ? exam : {},
    };
  }

  async saveResult(studentId: number, body: any): Promise<any> {
    try {
      const { type, idTest, userResult, timeStart, timeEnd } = body;
      const studentResult = userResult;

      const test = new Test();
      test.typeOfTest = type;
      test.timeStart = new Date(timeStart);
      test.timeEnd = new Date(timeEnd);
      const savedTest = await this.testRepository.save(test);

      if (type === 'FULL_TEST') {
        const fullTest = new FullTest();
        fullTest.testId = savedTest.id;
        fullTest.examId = idTest;
        await this.fullTestRepository.save(fullTest);

        const skillTest = new SkillTest();
        skillTest.testId = savedTest.id;
        skillTest.partId = idTest;
        await this.skillTestRepository.save(skillTest);

        for (const question of studentResult) {
          const foundQuestion =
            await this.examService.getQuestionByExamIdAndNum(
              idTest,
              question.number,
              type,
            );
          // return foundQuestion;
          // return;
          if (!foundQuestion || foundQuestion.length === 0) {
            throw new Error(
              `Question with number ${question.number} not found.`,
            );
          }

          const studentAnswer = new StudentAnswer();
          studentAnswer.studentId = studentId;
          studentAnswer.testId = savedTest.id;
          studentAnswer.questionId = foundQuestion[0].questionId;
          studentAnswer.selectedAnswer = question.result;
          await this.studentAnswerRepository.save(studentAnswer);
        }

        return {
          statusCode: 200,
          message: 'Result saved successfully.',
          testId: savedTest.id,
        };
      }
      if (type === 'SKILL_TEST') {
        const skillTest = new SkillTest();
        skillTest.testId = savedTest.id;
        skillTest.partId = idTest;
        await this.skillTestRepository.save(skillTest);

        for (const question of studentResult) {
          const foundQuestion =
            await this.examService.getQuestionByExamIdAndNum(
              idTest,
              question.number,
              type,
            );
          // return foundQuestion;
          if (!foundQuestion || foundQuestion.length === 0) {
            throw new Error(
              `Question with number ${question.number} not found.`,
            );
          }

          const studentAnswer = new StudentAnswer();
          studentAnswer.studentId = studentId;
          studentAnswer.testId = savedTest.id;
          studentAnswer.questionId = foundQuestion[0].questionId;
          studentAnswer.selectedAnswer = question.result;
          await this.studentAnswerRepository.save(studentAnswer);
        }

        return {
          statusCode: 200,
          message: 'Result saved successfully.',
          testId: savedTest.id,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'error saving result',
      };
    }
  }

  async getFullTestResult(id: number): Promise<any> {
    try {
      // const resultStudent = await this.examService.getResultFullTestById(id);
      // return data;
      const NUM_OF_QUESTION = 200;
      const testData = await this.testRepository
        .createQueryBuilder('test')
        .leftJoinAndSelect('test.fullTests', 'fullTest')
        .leftJoinAndSelect('fullTest.exam', 'exam')
        .leftJoinAndSelect('test.studentAnswers', 'studentAnswer')
        .leftJoinAndSelect('studentAnswer.question', 'question') //
        .where('test.id = :id', { id })
        .getOne();
      const userResult = [];
      testData.studentAnswers.forEach((item) => {
        userResult.push({
          number: item.question.numQuestion,
          result: item.selectedAnswer,
        });
      });

      const listCorrectAnswer = testData.studentAnswers.map((answer) => {
        return {
          numQuestion: answer.question.numQuestion,
          correctAnswer: answer.question.correctAnswer,
        };
      });
      // const userResults = resultStudent.userResult;
      const totalQuestionsInDatabase = NUM_OF_QUESTION;
      const totalQuestionsAnswered = userResult.filter(
        (item) => item.result !== null,
      ).length;
      let totalScore = 0;
      let totalCorrect = 0;
      let totalIncorrect = 0;

      const totalSkipped = totalQuestionsInDatabase - totalQuestionsAnswered;
      // Duyệt qua từng câu trả lời của học viên
      userResult.forEach((userAnswer) => {
        const questionNumber = userAnswer.number;
        const userResult = userAnswer.result;

        // Tìm câu trả lời chính xác từ cleanedData dựa trên số câu hỏi
        const correctAnswerObj = listCorrectAnswer.find(
          (question) => question.numQuestion === questionNumber,
        );

        if (correctAnswerObj) {
          const correctAnswer = correctAnswerObj.correctAnswer;

          if (userResult === correctAnswer) {
            // Đáp án đúng, tăng điểm và số câu đúng
            totalScore += 5;
            totalCorrect++;
          } else {
            // Đáp án sai, tăng số câu sai
            totalIncorrect++;
          }
        }
      });

      // Tính thời gian hoàn thành dưới dạng hh:mm:ss
      const nameOfTest = testData.fullTests[0].exam.name || null;
      const timeDiff =
        Date.parse(testData.timeEnd.toString()) -
        Date.parse(testData.timeStart.toString());
      const timeInSeconds = Math.floor(timeDiff / 1000);
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = timeInSeconds % 60;
      const timeDoing = `${hours}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      // const totalQuestionsâs = totalCorrect + totalIncorrect;
      const percentageCorrect = (totalCorrect / totalQuestionsInDatabase) * 100;

      return {
        statusCode: 200,
        message: 'success',
        data: {
          nameOfTest,
          totalCorrect,
          totalIncorrect,
          totalSkipped,
          percentageCorrect: percentageCorrect.toFixed(2),
          totalScore,
          timeDoing,
        },
      };

      // const nameOfTest = resultStudent.name;
      // const listCorrectAnswer = await this.examService.getCorrectAnswer(id);
      // const userResults = resultStudent.userResult;
      // const totalQuestionsInDatabase = listCorrectAnswer.length;
      // const totalQuestionsAnswered = userResults.filter(item => item.result !== null).length;
      // let totalScore = 0;
      // let totalCorrect = 0;
      // let totalIncorrect = 0;

      // const totalSkipped = totalQuestionsInDatabase - totalQuestionsAnswered;
      // // Duyệt qua từng câu trả lời của học viên
      // userResults.forEach(userAnswer => {
      //     const questionNumber = userAnswer.number;
      //     const userResult = userAnswer.result;
      //     console.log("user result", userResult);
      //     // Tìm câu trả lời chính xác từ cleanedData dựa trên số câu hỏi
      //     const correctAnswerObj = listCorrectAnswer.find(question => question.numQuestion === questionNumber);
      //     console.log(correctAnswerObj);
      //     if (correctAnswerObj) {
      //         const correctAnswer = correctAnswerObj.correctAnswer;

      //         if (userResult === correctAnswer) {
      //             // Đáp án đúng, tăng điểm và số câu đúng
      //             totalScore += 5; ``
      //             totalCorrect++;
      //         } else {
      //             // Đáp án sai, tăng số câu sai
      //             totalIncorrect++;
      //         }
      //     }
      // });

      // // Tính thời gian hoàn thành dưới dạng hh:mm:ss
      // const timeStart = new Date(resultStudent.timeStart);
      // const timeEnd = new Date(resultStudent.timeEnd);
      // const timeDiff = Date.parse(resultStudent.timeEnd) - Date.parse(resultStudent.timeStart);
      // const timeInSeconds = Math.floor(timeDiff / 1000);
      // const hours = Math.floor(timeInSeconds / 3600);
      // const minutes = Math.floor((timeInSeconds % 3600) / 60);
      // const seconds = timeInSeconds % 60;
      // const timeDoing = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      // // const totalQuestionsâs = totalCorrect + totalIncorrect;
      // const percentageCorrect = (totalCorrect / totalQuestionsInDatabase) * 100;

      // return {
      //     statusCode: 200,
      //     message: 'success',
      //     data: {
      //         nameOfTest,
      //         totalCorrect,
      //         totalIncorrect,
      //         totalSkipped,
      //         percentageCorrect: percentageCorrect.toFixed(2),
      //         totalScore,
      //         timeDoing,
      //     }
      // }
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          statusCode: 404,
          message: error.message,
          data: null,
        };
      }
      console.log(error);
      return {
        statusCode: 500,
        message: 'Internal server error',
      };
    }
  }

  async getSkillTestResult(skillTestId: number): Promise<any> {
    const testData = await this.testRepository
      .createQueryBuilder('test')
      .leftJoinAndSelect('test.skillTests', 'skillTest')
      .leftJoinAndSelect('skillTest.part', 'part')
      .leftJoinAndSelect('test.studentAnswers', 'studentAnswer')
      .leftJoinAndSelect('studentAnswer.question', 'question') //
      .where('test.id = :id', { id: skillTestId })
      .getOne();
    const totalQuestionsInDatabase =
      await this.examService.getNumberOfQuestionByPartId(
        testData.skillTests[0].part.id,
      );
    const userResult = [];
    testData.studentAnswers.forEach((item) => {
      userResult.push({
        number: item.question.numQuestion,
        result: item.selectedAnswer,
      });
    });

    const listCorrectAnswer = testData.studentAnswers.map((answer) => {
      return {
        numQuestion: answer.question.numQuestion,
        correctAnswer: answer.question.correctAnswer,
      };
    });
    // const userResults = resultStudent.userResult;
    // const totalQuestionsInDatabase = listCorrectAnswer.length;
    const totalQuestionsAnswered = userResult.filter(
      (item) => item.result !== null,
    ).length;
    let totalScore = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;

    const totalSkipped = totalQuestionsInDatabase - totalQuestionsAnswered;
    // Duyệt qua từng câu trả lời của học viên
    userResult.forEach((userAnswer) => {
      const questionNumber = userAnswer.number;
      const userResult = userAnswer.result;

      // Tìm câu trả lời chính xác từ cleanedData dựa trên số câu hỏi
      const correctAnswerObj = listCorrectAnswer.find(
        (question) => question.numQuestion === questionNumber,
      );

      if (correctAnswerObj) {
        const correctAnswer = correctAnswerObj.correctAnswer;

        if (userResult === correctAnswer) {
          // Đáp án đúng, tăng điểm và số câu đúng
          totalScore += 5;
          totalCorrect++;
        } else {
          // Đáp án sai, tăng số câu sai
          totalIncorrect++;
        }
      }
    });

    // Tính thời gian hoàn thành dưới dạng hh:mm:ss
    const nameOfTest = testData.skillTests[0].part.name || null;
    const timeDiff =
      Date.parse(testData.timeEnd.toString()) -
      Date.parse(testData.timeStart.toString());
    const timeInSeconds = Math.floor(timeDiff / 1000);
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    const timeDoing = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

    // const totalQuestionsâs = totalCorrect + totalIncorrect;
    const percentageCorrect = (totalCorrect / totalQuestionsInDatabase) * 100;

    return {
      statusCode: 200,
      message: 'success',
      data: {
        nameOfTest,
        totalCorrect,
        totalIncorrect,
        totalSkipped,
        percentageCorrect: percentageCorrect.toFixed(2),
        totalScore,
        timeDoing,
      },
    };
  }

  async getSkillTestResultDetail(skillTestId: number): Promise<any> {
    // const testData = await this.testRepository.createQueryBuilder('test')
    //     .leftJoinAndSelect('test.skillTests', 'skillTest')
    //     .leftJoinAndSelect('skillTest.part', 'part')
    //     .leftJoinAndSelect('test.studentAnswers', 'studentAnswer') //
    //     .leftJoinAndSelect('studentAnswer.question', 'question') //
    //     .leftJoinAndSelect('question.detailAnswer', 'detailAnswer') //
    //     .where('test.id = :id', { id: skillTestId })
    //     .getOne();

    const testData = await this.testRepository
      .createQueryBuilder('test')
      .leftJoinAndSelect('test.skillTests', 'skillTest')
      .leftJoinAndSelect('skillTest.part', 'part')
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
        'paragraphQuestion.detailAnswer',
        'detailAnswerParagraphQuestion',
      )
      .leftJoinAndSelect(
        'partQuestionQuestion.detailAnswer',
        'detailAnswerPartQuestionQuestion',
      )
      .leftJoinAndSelect(
        'paragraphQuestion.studentAnswers',
        'studentAnswerParagraphQuestion',
        'studentAnswerParagraphQuestion.testId = :testId',
        { testId: skillTestId },
      )
      .leftJoinAndSelect(
        'partQuestionQuestion.studentAnswers',
        'studentAnswerPartQuestionQuestion',
        'studentAnswerPartQuestionQuestion.testId = :testId',
        { testId: skillTestId },
      )
      .where('test.id = :id', { id: skillTestId })
      .getOne();
    // return testData;

    const dataResult = {
      answer: [],
      studentAnswer: [],
    };
    const partType = [];
    if (testData.skillTests[0].part.partQuestions.length > 0) {
      partType.push(testData.skillTests[0].part.partQuestions[0]);
      partType[0].questions.forEach((item) => {
        dataResult.answer.push({
          number: item.numQuestion,
          result: item.correctAnswer,
          transcript: item.detailAnswer?.explane || null,
        });
        dataResult.studentAnswer.push({
          number: item.numQuestion,
          result: item.studentAnswers[0]?.selectedAnswer || null,
        });
      });
    }
    if (testData.skillTests[0].part.partParagraphs.length > 0) {
      partType.push(testData.skillTests[0].part.partParagraphs[0]);
      // return partType;
      partType[0].paragraphs.forEach((item) => {
        item.questions.forEach((question) => {
          dataResult.answer.push({
            number: question.numQuestion,
            result: question.correctAnswer,
            transcript: question.detailAnswer?.explane || null,
          });
          dataResult.studentAnswer.push({
            number: question.numQuestion,
            result: question.studentAnswers[0]?.selectedAnswer || null,
          });
        });
      });
    }
    // return partType;
    // partType[0].questions.forEach(item => {
    //     dataResult.answer.push({
    //         number: item.numQuestion,
    //         result: item.correctAnswer,
    //         transcript: item.detailAnswer?.explane || null
    //     })
    //     dataResult.studentAnswer.push({
    //         number: item.numQuestion,
    //         result: item.studentAnswers[0]?.selectedAnswer || null,
    //     })
    // })
    return {
      statusCode: 200,
      message: 'success',
      data: dataResult,
    };
  }

  async getDetailAswerByExamId(fullTestId: number) {
    const testData = await this.testRepository
      .createQueryBuilder('test')
      .leftJoinAndSelect('test.fullTests', 'fullTest')
      .leftJoinAndSelect('fullTest.exam', 'exam')
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
        'paragraphQuestion.detailAnswer',
        'detailAnswerParagraphQuestion',
      )
      .leftJoinAndSelect(
        'partQuestionQuestion.detailAnswer',
        'detailAnswerPartQuestionQuestion',
      )
      .leftJoinAndSelect(
        'paragraphQuestion.studentAnswers',
        'studentAnswerParagraphQuestion',
        'studentAnswerParagraphQuestion.testId = :testId',
        { testId: fullTestId },
      )
      .leftJoinAndSelect(
        'partQuestionQuestion.studentAnswers',
        'studentAnswerPartQuestionQuestion',
        'studentAnswerPartQuestionQuestion.testId = :testId',
        { testId: fullTestId },
      )
      .where('test.id = :id', { id: fullTestId })
      .getOne();

    const dataResult = {
      answer: [],
      studentAnswer: [],
    };
    testData.fullTests[0].exam.parts.forEach((part) => {
      // dataResult.answer.push({
      //     number: item.numQuestion,
      //     result: item.correctAnswer,
      //     transcript: item.detailAnswer?.explane || null
      // })
      // dataResult.studentAnswer.push({
      //     number: item.numQuestion,
      //     result: item.studentAnswers[0]?.selectedAnswer || null,
      // })
      // parts.forEach(part => {
      part.partQuestions.forEach((partQuestion) => {
        partQuestion.questions.forEach((question) => {
          dataResult.answer.push({
            number: question.numQuestion,
            result: question.correctAnswer,
            transcript: question.detailAnswer?.explane || null,
          });

          dataResult.studentAnswer.push({
            number: question.numQuestion,
            result: question.studentAnswers[0]?.selectedAnswer || null,
          });
        });
      });

      part.partParagraphs.forEach((paragraph) => {
        paragraph.paragraphs.forEach((paragraphQuestion) => {
          paragraphQuestion.questions.forEach((question) => {
            dataResult.answer.push({
              number: question.numQuestion,
              result: question.correctAnswer,
              transcript: question.detailAnswer?.explane || null,
            });
            dataResult.studentAnswer.push({
              number: question.numQuestion,
              result: question.studentAnswers[0]?.selectedAnswer || null,
            });
          });
        });
      });
    });

    return {
      statusCode: 200,
      message: 'success',
      data: dataResult,
    };
  }

  async getTestByPartName(name: string): Promise<any> {
    const exam = await this.examService.getListPartByName(name);
    return {
      statusCode: 200,
      message: 'Get test by part name successfully',
      data: exam ? exam : {},
    };
  }

  async getPartById(name: string, id: number): Promise<any> {
    const exam = await this.examService.getPartById(name, id);
    return {
      statusCode: 200,
      message: 'Get part by id successfully',
      data: exam ? exam : {},
    };
  }

  async getHistory(id: number): Promise<any> {
    const data = await this.testRepository.createQueryBuilder('test')
      .leftJoinAndSelect('test.fullTests', 'fullTest')
      .leftJoinAndSelect('fullTest.exam', 'exam')
      .leftJoinAndSelect('test.studentAnswers', 'studentAnswer')
      .leftJoinAndSelect('studentAnswer.student', 'student')
      .where('studentAnswer.studentId = :id', { id })
      .getOne();

    if (!data) {
      return {
        statusCode: 200,
        message: 'Get history successfully',
        data: {},
      }
    }
    const result = {
      id: data.id,
      timeDoing: new Date(data.timeStart).toLocaleDateString(),
      name: data.fullTests[0].exam.name,
      score: data.score,
    }
    return {
      statusCode: 200,
      message: 'Get history successfully',
      data: result ? result : {},
    }
  }
}