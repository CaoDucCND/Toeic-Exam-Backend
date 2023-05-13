import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
// import { UserModule } from './user/user.module';
import { ToeicTestModule } from './toeic_test/toeic_test.module';
import { ExamModule } from './exam/exam.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ToeicTestModule, ExamModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
