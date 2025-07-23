import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

const prisma = new PrismaClient();

@Injectable()
export class AppointmentService {
  async create(data: CreateAppointmentDto) {
    return await prisma.appointment.create({ data });
  }

  async findAll() {
    return await prisma.appointment.findMany();
  }

  async findOne(id: number) {
    return await prisma.appointment.findUnique({ where: { id } });
  }
}
