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
  Query,
  UseGuards,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { petIdSchema } from './dto/zod.dto';

@ApiTags('pets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPetDto: CreatePetDto) {
    const petId = petIdSchema.safeParse(createPetDto);
    if (!petId.success) {
      throw new Error(petId.error.message);
    }
    return await this.petsService.create(createPetDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN')
  async findAll() {
    return await this.petsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string,
    @Query('clinicId') clinicId: number,
    @Query('userId') userId: number,
  ) {
    return await this.petsService.findOne(+id, +userId, +clinicId);
  }

  @Put(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() data: CreatePetDto) {
    const petId = petIdSchema.safeParse(data);
    if (!petId.success) {
      throw new Error(petId.error.message);
    }
    return await this.petsService.update(+id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.petsService.remove(+id);
  }
}
