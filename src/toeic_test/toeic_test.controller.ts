import { Controller, Get, Param } from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';

@Controller('tests')
export class ToeicTestController {
  constructor(private readonly toeicTestService: ToeicTestService) { }
  @Get('/full-test')
  async getFullTest() {
    return this.toeicTestService.getFullTest();
  }
  @Get('/full-test/:id')
  async getTestById(@Param('id') id: string) {
    return this.toeicTestService.getTestById(+id);
  }
}
