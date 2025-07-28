import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { createClinicDtoSchema } from './dto/zod.dto';

@ApiTags('clinic')
@Controller('clinic')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClinicDto: CreateClinicDto) {
    const result = createClinicDtoSchema.safeParse(createClinicDto);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return this.clinicService.create(createClinicDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.clinicService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.clinicService.findOne(+id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.clinicService.remove(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateClinicDto: CreateClinicDto) {
    const result = createClinicDtoSchema.safeParse(updateClinicDto);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return this.clinicService.update(+id, updateClinicDto);
  }
}
