import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateVaccineHistoryDto } from './dto/create-vaccine-history.dto';

const prisma = new PrismaClient();

@Injectable()
export class VaccineHistoryService {
  async create(data: CreateVaccineHistoryDto) {
    return await prisma.vaccineHistory.create({ data });
  }

  async findAll() {
    return await prisma.vaccineHistory.findMany();
  }

  async findOne(id: number) {
    return await prisma.vaccineHistory.findUnique({ where: { id } });
  }
}
