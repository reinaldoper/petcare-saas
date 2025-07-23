import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
