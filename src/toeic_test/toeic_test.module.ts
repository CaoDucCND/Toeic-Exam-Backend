import { Module } from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';
import { ToeicTestController } from './toeic_test.controller';

@Module({
  controllers: [ToeicTestController],
  providers: [ToeicTestService]
})
export class ToeicTestModule {}
