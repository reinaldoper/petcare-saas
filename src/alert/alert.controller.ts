import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
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

  @Get('upcoming/:clinicId')
  @HttpCode(HttpStatus.OK)
  async findUpcoming(@Param('clinicId') clinicId: number) {
    return await this.service.findUpcoming(Number(clinicId));
  }

  @Get('ping')
  ping() {
    return { status: 'awake', timestamp: new Date() };
  }
}
