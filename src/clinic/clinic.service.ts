import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateClinicDto } from './dto/create-clinic.dto';

const prisma = new PrismaClient();
@Injectable()
export class ClinicService {
  async create(data: CreateClinicDto): Promise<CreateClinicDto | null> {
    const { name } = data;
    if (!name) {
      return null;
    }
    const existingClinic = await prisma.clinic.findUnique({ where: { name } });
    if (existingClinic) {
      return null;
    }
    const clinic = await prisma.clinic.create({
      data,
      include: { users: true, pets: true, stock: true, plan: true },
    });
    return clinic as CreateClinicDto;
  }
  async findAll(): Promise<CreateClinicDto[]> {
    const all = await prisma.clinic.findMany({
      orderBy: { name: 'asc' },
      include: { users: true, pets: true, stock: true },
    });
    return all as CreateClinicDto[];
  }
  async findOne(id: number): Promise<CreateClinicDto | null> {
    const one = await prisma.clinic.findUnique({
      where: { id },
      include: { users: true, pets: true, stock: true },
    });
    return one as CreateClinicDto | null;
  }
  async remove(id: number): Promise<CreateClinicDto | null> {
    const clinic = await prisma.clinic.findUnique({ where: { id } });
    if (!clinic) {
      return null;
    }
    const deleted = await prisma.clinic.delete({ where: { id } });
    return deleted as CreateClinicDto | null;
  }

  async search(name: string): Promise<CreateClinicDto> {
    const clinics = await prisma.clinic.findUnique({
      where: { name },
      include: { users: true, pets: true, stock: true, plan: true },
    });
    return clinics as unknown as CreateClinicDto;
  }

  async update(
    id: number,
    data: CreateClinicDto,
  ): Promise<CreateClinicDto | null> {
    const clinic = await prisma.clinic.findUnique({ where: { id } });
    if (!clinic) {
      return null;
    }
    const updatedClinic = await prisma.clinic.update({
      where: { id },
      data,
    });
    return updatedClinic as CreateClinicDto;
  }
}
