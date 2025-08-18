import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateVaccineHistoryDto,
  CreateClinicIdDto,
} from './dto/create-vaccine-history.dto';

@Injectable()
export class VaccineHistoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateVaccineHistoryDto) {
    const date = new Date(data.appliedAt).toISOString();
    data.appliedAt = date;
    return await this.prisma.vaccineHistory.create({ data });
  }

  async findAll(id: number, body: CreateClinicIdDto) {
    return await this.prisma.vaccineHistory.findMany({
      where: { petId: id, clinicId: body.clinicId },
    });
  }

  async findOne(id: number) {
    return await this.prisma.vaccineHistory.findUnique({ where: { id } });
  }
}
