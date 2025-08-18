import { Module } from '@nestjs/common';
import { VaccineHistoryService } from './vaccine-history.service';
import { VaccineHistoryController } from './vaccine-history.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VaccineHistoryController],
  providers: [VaccineHistoryService],
})
export class VaccineHistoryModule {}
