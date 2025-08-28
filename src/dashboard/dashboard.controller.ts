import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/:clinicId')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  getDashboard(@Param('clinicId') clinicId: number) {
    return this.dashboardService.getMetrics(clinicId);
  }
}
