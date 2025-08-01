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
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { createStockSchema } from './dto/zod.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(private readonly service: StockService) {}

  @Post()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateStockDto) {
    const result = createStockSchema.safeParse(dto);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return await this.service.create(dto);
  }

  @Get(':clinicId')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('clinicId') clinicId: string) {
    return await this.service.findMany(+clinicId);
  }
}
