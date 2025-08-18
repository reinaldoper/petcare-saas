import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPetDto: CreatePetDto) {
    const clinicId = createPetDto.clinicId;
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { plan: true },
    });

    if (!clinic) {
      throw new Error('Clínica não encontrada.');
    }
    if (clinic.plan?.type === 'FREE') {
      const petCount = await this.prisma.pet.count({
        where: { clinicId },
      });

      if (petCount >= 10) {
        throw new Error('Limite de 10 pets atingido para o plano gratuito.');
      }
    }

    return await this.prisma.pet.create({ data: createPetDto });
  }

  async findAll({ clinicId }: { clinicId: number }) {
    const users = await this.prisma.pet.findMany({
      where: { clinicId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            role: true,
            id: true,
            clinicId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        clinic: true,
        vaccines: true,
      },
    });

    const filtered = users.filter((pet) => pet.user?.role === 'CLIENT');

    return filtered;
  }

  async findOne(id: number, userId: number, clinicId: number) {
    return await this.prisma.pet.findUnique({
      where: { id, userId, clinicId },
      include: { user: true, clinic: true },
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

    const pet = await this.prisma.pet.findFirst({
      where: { id, clinicId },
    });

    if (!pet) {
      throw new Error('Pet não encontrado ou não pertence à clínica.');
    }

    return await this.prisma.pet.delete({
      where: { id },
    });
  }

  async update(id: number, data: CreatePetDto) {
    const plan = await this.prisma.clinic.findUnique({
      where: { id: data.clinicId },
      select: { plan: true },
    });

    if (!plan) {
      throw new Error('Clínica não encontrada.');
    }
    if (plan.plan?.type === 'FREE') {
      throw new Error('Clinica não autorizada.');
    }
    return await this.prisma.pet.update({ where: { id }, data });
  }
}
