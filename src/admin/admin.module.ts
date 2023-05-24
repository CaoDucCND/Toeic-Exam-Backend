import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ExamModule } from 'src/exam/exam.module';
import { AdminProviders } from './providers/admin.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ExamModule, DatabaseModule],
  controllers: [AdminController],
  providers: [AdminService, ...AdminProviders],
})
export class AdminModule {}
