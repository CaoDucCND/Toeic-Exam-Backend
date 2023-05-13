import { Injectable } from '@nestjs/common';
import { ExamService } from 'src/exam/exam.service';

@Injectable()
export class ToeicTestService {
    constructor(private examService: ExamService) { }

    async getFullTest(): Promise<any> {
        const listExam = await this.examService.findAll();
        return {
            statusCode: 200,
            message: 'Get full test successfully',
            data: listExam ? listExam : []
        }
    }

    async getTestById(id: number): Promise<any> {
        
        const exam = await this.examService.findOne(id);
        
        return {
            statusCode: 200,
            message: 'Get test by id successfully',
            data: exam ? exam : {}
        }
    }

}