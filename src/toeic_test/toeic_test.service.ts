import { Injectable } from '@nestjs/common';
import { ExamService } from 'src/exam/exam.service';

@Injectable()
export class ToeicTestService {
    constructor(private examService: ExamService) { }



  async  getDetailAswerByExamId(id: number) {
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

    async getFullTestMark(id: number, body: any): Promise<any> {
        const data = await this.examService.getCorrectAnswer(id);

        const userResults = body.userResult[0];
        const totalQuestionsInDatabase = data.length;
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
            const correctAnswerObj = data.find(question => question.numQuestion === questionNumber);

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
        const timeStart = new Date(body.timeStart);
        const timeEnd = new Date(body.timeEnd);
        const timeDiff = Date.parse(body.timeEnd) - Date.parse(body.timeStart);
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