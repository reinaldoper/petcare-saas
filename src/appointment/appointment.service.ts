import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateAppointmentDto) {
    const date = new Date(data.date).toISOString();
    data.date = date;
    return await this.prisma.appointment.create({
      data,
    });
  }

  async findAll(body: { clinicId: number }) {
    const { clinicId } = body;
    return await this.prisma.appointment.findMany({
      where: { clinicId },
      orderBy: { date: 'asc' },
      include: {
        pet: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findOne(id: number, clinicId: number) {
    return await this.prisma.appointment.findUnique({
      where: { id, clinicId },
    });
  }

  async updateAppointment(id: number, data: CreateAppointmentDto) {
    const date = new Date(data.date).toISOString();
    return await this.prisma.appointment.update({
      where: { id },
      data: { ...data, date },
    });
  }

  async remove(id: number, clinicId: number) {
    const plan = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { plan: true },
    });

    if (!plan) {
      throw new Error('Clínica não encontrada.');
    }

    if (plan.plan?.type === 'FREE') {
      throw new Error('Clínica não autorizada.');
    }

    const appointment = await this.prisma.appointment.findFirst({
      where: { id, clinicId },
    });

    if (!appointment) {
      throw new Error('Agendamento não encontrado ou não pertence à clínica.');
    }

    return await this.prisma.appointment.delete({
      where: { id },
    });
  }
}
