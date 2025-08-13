import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

const prisma = new PrismaClient();

@Injectable()
export class AppointmentService {
  async create(data: CreateAppointmentDto) {
    return await prisma.appointment.create({
      data,
    });
  }

  async findAll(body: { clinicId: number }) {
    const { clinicId } = body;
    return await prisma.appointment.findMany({
      where: { clinicId },
      orderBy: { date: 'asc' },
      include: { pet: true },
    });
  }

  async findOne(id: number, clinicId: number) {
    return await prisma.appointment.findUnique({ where: { id, clinicId } });
  }

  async updateAppointment(id: number, data: CreateAppointmentDto) {
    const date = new Date(data.date).toISOString();
    return await prisma.appointment.update({
      where: { id },
      data: { ...data, date },
    });
  }

  async remove(id: number) {
    return await prisma.appointment.delete({ where: { id } });
  }
}
