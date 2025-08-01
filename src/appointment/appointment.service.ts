import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

const prisma = new PrismaClient();

@Injectable()
export class AppointmentService {
  async create(data: CreateAppointmentDto) {
    const date = new Date(data.date).toISOString();
    return await prisma.appointment.create({
      data: { ...data, date },
    });
  }

  async findAll(body: { clinicId: number }) {
    const { clinicId } = body;
    return await prisma.appointment.findMany({
      where: { clinicId },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: number, clinicId: number) {
    return await prisma.appointment.findUnique({ where: { id, clinicId } });
  }
}
