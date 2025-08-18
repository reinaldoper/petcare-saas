import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(clinicId: number) {
    return this.prisma.plan.findFirst({
      where: { clinicId },
      orderBy: { type: 'asc' },
    });
  }

  async create(data: CreatePlanDto) {
    return this.prisma.plan.create({ data });
  }

  async remove(id: number) {
    return this.prisma.plan.delete({ where: { id } });
  }

  async update(id: number, data: CreatePlanDto) {
    return this.prisma.plan.update({ where: { id }, data });
  }
}
