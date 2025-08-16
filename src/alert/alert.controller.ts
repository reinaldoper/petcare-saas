import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AlertService } from './alert.service';
import { ApiTags } from '@nestjs/swagger';
import { AlertsGateway } from './alerts.gateway';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
  constructor(
    private readonly service: AlertService,
    private readonly alertsGateway: AlertsGateway,
  ) {}

  @Get('upcoming')
  @HttpCode(HttpStatus.OK)
  async findUpcoming() {
    return await this.service.findUpcoming();
  }

  @Get('ping')
  ping() {
    return { status: 'awake', timestamp: new Date() };
  }
}
