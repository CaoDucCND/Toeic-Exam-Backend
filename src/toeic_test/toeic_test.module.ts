import { Module } from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';
import { ToeicTestController } from './toeic_test.controller';
import { ExamModule } from 'src/exam/exam.module';

@Module({
  imports: [ExamModule],
  controllers: [ToeicTestController],
  providers: [ToeicTestService]
})
export class ToeicTestModule { }
