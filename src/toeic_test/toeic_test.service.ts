import { Inject, Injectable } from '@nestjs/common';
import { ExamService } from 'src/exam/exam.service';
import { StudentAnswer } from 'src/entities/StudentAnswer';
import { Test } from 'src/entities/Test';
import { Repository } from 'typeorm';
import { Student } from 'src/entities/Student';
import { FullTest } from 'src/entities/FullTest';
import { Exam } from 'src/entities/Exam';
import { async } from 'rxjs';

@Injectable()
export class ToeicTestService {
    constructor(private examService: ExamService,
        @Inject('STUDENT_REPOSITORY') private studentRepository: Repository<Student>,
        @Inject('STUDENT_ANSWER_REPOSITORY') private studentAnswerRepository: Repository<StudentAnswer>,
        @Inject('TEST_REPOSITORY') private testRepository: Repository<Test>,
        @Inject('FULL_TEST_REPOSITORY') private fullTestRepository: Repository<FullTest>,
    ) { }



    async getDetailAswerByExamId(id: number) {
        console.log(id);
        const res = await this.examService.getDetailAswerByExamId(id);
        return {
            statusCode: 200,
            message: 'Get detil Answer test successfully',
            data: res ? res : []
        }
    }

    async getFullTest(): Promise<any> {
        const listExam = await this.examService.findAll();
        return {
            statusCode: 200,
            message: 'Get full test successfully',
            data: listExam ? listExam : []
        }
    }

    async getFullTestById(id: number): Promise<any> {

        const exam = await this.examService.findOne(id);

        return {
            statusCode: 200,
            message: 'Get test by id successfully',
            data: exam ? exam : {}
        }
    }

    async saveResult(studentId: number, body: any): Promise<any> {
        try {
            const { type, idTest, userResult, timeStart, timeEnd } = body;
            const studentResult = userResult[0];

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
            }

            for (const question of studentResult) {
                const foundQuestion = await this.examService.getQuestionByExamIdAndNum(idTest, question.number);

                if (!foundQuestion || foundQuestion.length === 0) {
                    throw new Error(`Question with number ${question.number} not found.`);
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
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'error saving result',
            };
        }
    }


    async getFullTestResult(id: number): Promise<any> {
        const resultStudent = await this.examService.getResultFullTestById(id);
        // return data;
        const nameOfTest = resultStudent.name;
        const listCorrectAnswer = await this.examService.getCorrectAnswer(id);
        const userResults = resultStudent.userResult;
        const totalQuestionsInDatabase = listCorrectAnswer.length;
        const totalQuestionsAnswered = userResults.length;
        let totalScore = 0;
        let totalCorrect = 0;
        let totalIncorrect = 0;

        const totalSkipped = totalQuestionsInDatabase - totalQuestionsAnswered;
        // Duyệt qua từng câu trả lời của học viên
        userResults.forEach(userAnswer => {
            const questionNumber = userAnswer.number;
            const userResult = userAnswer.result;

            // Tìm câu trả lời chính xác từ cleanedData dựa trên số câu hỏi
            const correctAnswerObj = listCorrectAnswer.find(question => question.numQuestion === questionNumber);

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
        const timeStart = new Date(resultStudent.timeStart);
        const timeEnd = new Date(resultStudent.timeEnd);
        const timeDiff = Date.parse(resultStudent.timeEnd) - Date.parse(resultStudent.timeStart);
        const timeInSeconds = Math.floor(timeDiff / 1000);
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        const timeDoing = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // const totalQuestionsâs = totalCorrect + totalIncorrect;
        const percentageCorrect = (totalCorrect / totalQuestionsInDatabase) * 100;
        // console.log("Total questions in database:", totalQuestionsInDatabase);
        // console.log("Total questions answered:", totalQuestionsAnswered);
        // console.log("Total skipped:", totalSkipped);
        // console.log("Percentage correct:", percentageCorrect.toFixed(2) + "%");
        // console.log("Total score:", totalScore);
        // console.log("Total correct answers:", totalCorrect);
        // console.log("Total incorrect answers:", totalIncorrect);
        // console.log("Time taken:", formattedTime);
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
            }
        }
    }



    async getTestByPartName(name: string): Promise<any> {
        const exam = await this.examService.getListPartByName(name);
        return {
            statusCode: 200,
            message: 'Get test by part name successfully',
            data: exam ? exam : {}
        }
    }

    async getPartById(name: string, id: number): Promise<any> {
        const exam = await this.examService.getPartById(name, id);
        return {
            statusCode: 200,
            message: 'Get part by id successfully',
            data: exam ? exam : {}
        }
    }

}