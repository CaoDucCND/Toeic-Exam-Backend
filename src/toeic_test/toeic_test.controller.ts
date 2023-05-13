import { Controller } from '@nestjs/common';
import { ToeicTestService } from './toeic_test.service';

@Controller('toeic-test')
export class ToeicTestController {
  constructor(private readonly toeicTestService: ToeicTestService) {}
}
