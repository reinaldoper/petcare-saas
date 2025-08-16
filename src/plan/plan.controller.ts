import {
  Controller,
  Post,
  Get,
  Put,
  UseGuards,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { createPlanDtoSchema } from './dto/zod.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() data: CreatePlanDto) {
    const result = createPlanDtoSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return this.planService.create(data);
  }

  @Get(':clinicId')
  async findAll(@Param('clinicId') clinicId: number) {
    if (isNaN(clinicId)) {
      throw new Error('ClinicId inválido');
    }
    return this.planService.findAll(clinicId);
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() data: CreatePlanDto) {
    const result = createPlanDtoSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return this.planService.update(+id, data);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    if (isNaN(+id)) {
      throw new Error('Id inválido!');
    }
    return this.planService.remove(+id);
  }
}
