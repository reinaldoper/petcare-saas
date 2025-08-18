import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

const prisma = new PrismaClient();

@Injectable()
export class AppointmentService {
  async create(data: CreateAppointmentDto) {
    const date = new Date(data.date).toISOString();
    data.date = date;
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

  async remove(id: number, clinicId: number) {
    const plan = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { plan: true },
    });

    if (!plan) {
      throw new Error('Clínica não encontrada.');
    }

    if (plan.plan?.type === 'FREE') {
      throw new Error('Clínica não autorizada.');
    }

    const appointment = await prisma.appointment.findFirst({
      where: { id, clinicId },
    });

    if (!appointment) {
      throw new Error('Agendamento não encontrado ou não pertence à clínica.');
    }

    return await prisma.appointment.delete({
      where: { id },
    });
  }
}
