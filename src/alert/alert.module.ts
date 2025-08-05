import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { AlertsGateway } from './alerts.gateway';

@Module({
  controllers: [AlertController],
  providers: [AlertService, AlertsGateway],
  exports: [AlertsGateway],
})
export class AlertModule {}
