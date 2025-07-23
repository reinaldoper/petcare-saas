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
import { VaccineHistoryService } from './vaccine-history.service';
import { CreateVaccineHistoryDto } from './dto/create-vaccine-history.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createVaccineSchema } from './dto/zod.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('vaccine-history')
@Controller('vaccine-history')
export class VaccineHistoryController {
  constructor(private readonly service: VaccineHistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateVaccineHistoryDto) {
    const result = createVaccineSchema.safeParse(dto);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return await this.service.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(+id);
  }
}
