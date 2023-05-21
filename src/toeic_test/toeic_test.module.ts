import { Module } from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';
import { ToeicTestController } from './toeic_test.controller';
import { ExamModule } from 'src/exam/exam.module';
import { TestProviders } from './providers/toeic_test.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ExamModule, DatabaseModule],
  controllers: [ToeicTestController],
  providers: [ToeicTestService, ...TestProviders],
})
export class ToeicTestModule { }
