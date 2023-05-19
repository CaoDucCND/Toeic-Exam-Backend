import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';

@Controller('tests')
export class ToeicTestController {
  constructor(private readonly toeicTestService: ToeicTestService) { }
  @Get('/full-test')
  async getFullTest() {
    return this.toeicTestService.getFullTest();
  }
  //luu dư lieu
  @Post('/full-test/result/:id')
  async saveResult(@Param('id') id: string, @Body() body: any) {
    console.log("result");
    return this.toeicTestService.saveResult(+id, body);
  }
  //lay dulieu
  @Get('/full-test/result/:id')
  async getFullTestMark(@Param('id') id: string) {
    console.log("result");
    return this.toeicTestService.getFullTestResult(+id);
  }

  @Get('/full-test/result/:id/detail')
  async getFullTestResultDetail(@Param('id') id: string) {
    return this.toeicTestService.getDetailAswerByExamId(+id);
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
