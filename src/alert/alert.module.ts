import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { AlertsGateway } from './alerts.gateway';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AlertController],
  providers: [AlertService, AlertsGateway],
  exports: [AlertsGateway],
})
export class AlertModule {}
