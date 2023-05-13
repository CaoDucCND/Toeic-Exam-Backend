import { Test, TestingModule } from '@nestjs/testing';
import { ToeicTestController } from './toeic_test.controller';
import { ToeicTestService } from './toeic_test.service';

describe('ToeicTestController', () => {
  let controller: ToeicTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToeicTestController],
      providers: [ToeicTestService],
    }).compile();

    controller = module.get<ToeicTestController>(ToeicTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
