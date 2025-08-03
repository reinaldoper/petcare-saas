import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
  Put,
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
    if (!clinicId || isNaN(+clinicId)) {
      throw new Error('clinicId inválido!');
    }
    return await this.service.findMany(+clinicId);
  }

  @Get(':id/stock')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async getStockById(@Param('id') id: string) {
    if (!id || isNaN(+id)) {
      throw new Error('id inválido!');
    }
    return await this.service.getStockById(+id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    if (!id || isNaN(+id)) {
      throw new Error('id inválido!');
    }
    return await this.service.remove(+id);
  }

  @Put(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() data: CreateStockDto) {
    const result = createStockSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    if (!id || isNaN(+id)) {
      throw new Error('id inválido!');
    }
    return await this.service.updateStock(+id, data);
  }
}
