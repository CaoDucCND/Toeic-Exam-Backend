import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';

@Controller('tests')
export class ToeicTestController {
  constructor(private readonly toeicTestService: ToeicTestService) { }
  @Get('/full-test')
  async getFullTest() {
    return this.toeicTestService.getFullTest();
  }

  @Post('/full-test/result/:id')
  async getFullTestMark(@Param('id') id: string, @Body() body: any) {
    return this.toeicTestService.getFullTestMark(+id, body);
  }


  @Get('/full-test/:id')
  async getFullTestById(@Param('id') id: string) {
    return this.toeicTestService.getFullTestById(+id);
  }

  @Get('/skill-test/:name')
  async getListPart(@Param('name') name: string) {
    return this.toeicTestService.getTestByPartName(name);
  }

  @Get('/skill-test/:name/:id')
  getDetailPart(@Param('name') name: string, @Param('id') id: string) {
    return this.toeicTestService.getPartById(name, +id);
  }
}
