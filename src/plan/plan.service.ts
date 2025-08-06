import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePlanDto } from './dto/create-plan.dto';
const prisma = new PrismaClient();

@Injectable()
export class PlanService {
  constructor() {}

  async findAll(clinicId: number) {
    return prisma.plan.findMany({
      where: { clinicId },
      orderBy: { type: 'asc' },
    });
  }

  async create(data: CreatePlanDto) {
    return prisma.plan.create({ data });
  }

  async remove(id: number) {
    return prisma.plan.delete({ where: { id } });
  }

  async update(id: number, data: CreatePlanDto) {
    return prisma.plan.update({ where: { id }, data });
  }
}
