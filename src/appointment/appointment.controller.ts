import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  Delete,
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

  @Patch()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async findAll(@Body() body: { clinicId: number }) {
    if (!body.clinicId || isNaN(body.clinicId)) {
      throw new Error('ClinicId inválido!');
    }
    return await this.appointmentService.findAll(body);
  }

  @Get(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string,
    @Query() clinicId: { clinicId: number },
  ) {
    return await this.appointmentService.findOne(+id, clinicId.clinicId);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() data: CreateAppointmentDto) {
    const result = createAppointmentDtoSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return await this.appointmentService.updateAppointment(+id, data);
  }

  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (isNaN(+id)) {
      throw new Error('Id inválido!');
    }
    return await this.appointmentService.remove(+id);
  }
}
