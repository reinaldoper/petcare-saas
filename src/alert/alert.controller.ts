import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AlertService } from './alert.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
  constructor(private readonly service: AlertService) {}

  @Get('upcoming')
  @HttpCode(HttpStatus.OK)
  async findUpcoming() {
    return await this.service.findUpcoming();
  }
}
