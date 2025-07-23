import { Test, TestingModule } from '@nestjs/testing';
import { VaccineHistoryController } from './vaccine-history.controller';
import { VaccineHistoryService } from './vaccine-history.service';

describe('VaccineHistoryController', () => {
  let controller: VaccineHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaccineHistoryController],
      providers: [VaccineHistoryService],
    }).compile();

    controller = module.get<VaccineHistoryController>(VaccineHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
