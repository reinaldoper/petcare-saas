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
    const [datePart, timePart] = data.appliedAt.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);

    const localDateTime = new Date(year, month - 1, day, hour, minute);

    data.appliedAt = localDateTime as any;

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
