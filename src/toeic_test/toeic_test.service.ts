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

    async getFullTestById(id: number): Promise<any> {

        const exam = await this.examService.findOne(id);

        return {
            statusCode: 200,
            message: 'Get test by id successfully',
            data: exam ? exam : {}
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