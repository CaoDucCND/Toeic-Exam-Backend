import { Test, TestingModule } from '@nestjs/testing';
import { ToeicTestService } from './toeic_test.service';

describe('ToeicTestService', () => {
  let service: ToeicTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToeicTestService],
    }).compile();

    service = module.get<ToeicTestService>(ToeicTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
