import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanService {
  constructor(private readonly prisma = new PrismaClient()) {}

  async findAll(clinicId: number) {
    return this.prisma.plan.findMany({
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
