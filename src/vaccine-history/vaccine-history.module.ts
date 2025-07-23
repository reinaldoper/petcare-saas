import { Module } from '@nestjs/common';
import { VaccineHistoryService } from './vaccine-history.service';
import { VaccineHistoryController } from './vaccine-history.controller';

@Module({
  controllers: [VaccineHistoryController],
  providers: [VaccineHistoryService],
})
export class VaccineHistoryModule {}
