import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto, DeletePetDto } from './dto/create-pet';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { petIdSchema, deletePetIdSchema } from './dto/zod.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('pets')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPetDto: CreatePetDto) {
    const petId = petIdSchema.safeParse(createPetDto);
    if (!petId.success) {
      throw new Error(petId.error.message);
    }
    return await this.petsService.create(createPetDto);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN')
  async findAll(@Body() body: { clinicId: number }) {
    if (!body.clinicId || isNaN(body.clinicId)) {
      throw new Error('clinicId is required');
    }
    return await this.petsService.findAll(body);
  }

  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Patch('/clinic')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Body() body: { id: number; userId: number; clinicId: number },
  ) {
    const { id, userId, clinicId } = body;
    if (!id || isNaN(id)) {
      throw new Error('id é requerido');
    }
    if (!userId || isNaN(userId)) {
      throw new Error('userId é requerido');
    }
    if (!clinicId || isNaN(clinicId)) {
      throw new Error('clinicId é requerido');
    }
    return await this.petsService.findOne(+id, +userId, +clinicId);
  }

  @Throttle({ default: { limit: 5, ttl: 60 } })
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

  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Body() data: DeletePetDto) {
    if (!id || isNaN(+id)) {
      throw new Error('id inválido!');
    }
    const petId = deletePetIdSchema.safeParse(data);
    if (!petId.success) {
      throw new Error(petId.error.message);
    }
    return await this.petsService.remove(+id, +data.clinicId);
  }
}
