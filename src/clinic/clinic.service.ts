import { Injectable } from '@nestjs/common';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClinicService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateClinicDto): Promise<CreateClinicDto | null> {
    const { name } = data;
    if (!name) {
      return null;
    }
    const existingClinic = await this.prisma.clinic.findUnique({
      where: { name },
    });
    if (existingClinic) {
      return null;
    }
    const clinic = await this.prisma.clinic.create({
      data,
      include: { users: true, pets: true, stock: true, plan: true },
    });
    return clinic;
  }
  async findAll(): Promise<CreateClinicDto[]> {
    const all = await this.prisma.clinic.findMany({
      orderBy: { name: 'asc' },
      include: { users: true, pets: true, stock: true },
    });
    return all as CreateClinicDto[];
  }
  async findOne(id: number): Promise<CreateClinicDto | null> {
    const one = await this.prisma.clinic.findUnique({
      where: { id },
      include: { users: true, pets: true, stock: true },
    });
    return one as CreateClinicDto | null;
  }
  async remove(id: number): Promise<CreateClinicDto | null> {
    const clinic = await this.prisma.clinic.findUnique({ where: { id } });
    if (!clinic) {
      return null;
    }
    const deleted = await this.prisma.clinic.delete({ where: { id } });
    return deleted as CreateClinicDto | null;
  }

  async search(name: string): Promise<CreateClinicDto> {
    const clinics = await this.prisma.clinic.findUnique({
      where: { name },
      include: { users: true, pets: true, stock: true, plan: true },
    });
    return clinics as unknown as CreateClinicDto;
  }

  async update(
    id: number,
    data: CreateClinicDto,
  ): Promise<CreateClinicDto | null> {
    const clinic = await this.prisma.clinic.findUnique({ where: { id } });
    if (!clinic) {
      return null;
    }
    const updatedClinic = await this.prisma.clinic.update({
      where: { id },
      data,
    });
    return updatedClinic as CreateClinicDto;
  }
}
