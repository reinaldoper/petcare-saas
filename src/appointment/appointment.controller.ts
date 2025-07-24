import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createAppointmentDtoSchema } from './dto/zod.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAppointmentDto) {
    const result = createAppointmentDtoSchema.safeParse(dto);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return await this.appointmentService.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.appointmentService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.appointmentService.findOne(+id);
  }
}
