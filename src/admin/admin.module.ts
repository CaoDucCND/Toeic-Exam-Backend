import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ExamModule } from 'src/exam/exam.module';
import { AdminProviders } from './providers/admin.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { BlogService } from './providers/blog.service';

@Module({
  imports: [ExamModule, DatabaseModule, UserModule, ExamModule],
  controllers: [AdminController],
  providers: [AdminService, BlogService, ...AdminProviders],
})
export class AdminModule { }
