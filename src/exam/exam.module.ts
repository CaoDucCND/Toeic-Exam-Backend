import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { ExamProviders } from './providers/exam.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ExamController],
  providers: [ExamService, ...ExamProviders],
})
export class ExamModule {}
