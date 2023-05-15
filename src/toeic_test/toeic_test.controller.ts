import { Controller, Get, Param } from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';

@Controller('tests')
export class ToeicTestController {
  constructor(private readonly toeicTestService: ToeicTestService) { }
  @Get('/full-test')
  async getFullTest() {
    return this.toeicTestService.getFullTest();
  }
  @Get('/skill-test/:name')
  async getTestById(@Param('name') name: string) {
    return this.toeicTestService.getTestByPartName(name);
  }

  @Get('/skill-test/:name/:id')
  findPartById(@Param('name') name: string, @Param('id') id: string) {
    return this.toeicTestService.getPartById(name, +id);
  }
  // @Get('/skill-test')
}
