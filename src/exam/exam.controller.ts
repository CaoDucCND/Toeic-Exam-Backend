import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  // @Post()
  // create(@Body() createExamDto: CreateExamDto) {
  //   return this.examService.create(createExamDto);
  // }

  // @Get()
  // findAll(): Promise<any> {
  //   return this.examService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.examService.findOne(+id);
  // }

  // @Get('/part/:name')
  // findListPart(@Param('name') name: string) {
  //   console.log("checkName", name);
  //   return this.examService.getListPartByName(name);
  // }

  // @Get('/part/:name/:id')
  // findPartById(@Param('name') name: string, @Param('id') id: string) {
  //   return this.examService.getPartById(name, +id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
  //   return this.examService.update(+id, updateExamDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.examService.remove(+id);
  // }
}
