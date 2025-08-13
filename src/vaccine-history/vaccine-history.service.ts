import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreateVaccineHistoryDto,
  CreateClinicIdDto,
} from './dto/create-vaccine-history.dto';

const prisma = new PrismaClient();

@Injectable()
export class VaccineHistoryService {
  async create(data: CreateVaccineHistoryDto) {
    return await prisma.vaccineHistory.create({ data });
  }

  async findAll(id: number, body: CreateClinicIdDto) {
    return await prisma.vaccineHistory.findMany({
      where: { petId: id, clinicId: body.clinicId },
    });
  }

  async findOne(id: number) {
    return await prisma.vaccineHistory.findUnique({ where: { id } });
  }
}
