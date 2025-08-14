import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePetDto } from './dto/create-pet';

const prisma = new PrismaClient();
@Injectable()
export class PetsService {
  async create(createPetDto: CreatePetDto) {
    const clinicId = createPetDto.clinicId;
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { plan: true },
    });

    if (!clinic) {
      throw new Error('Clínica não encontrada.');
    }
    if (clinic.plan?.type === 'FREE') {
      const petCount = await prisma.pet.count({
        where: { clinicId },
      });

      if (petCount >= 10) {
        throw new Error('Limite de 10 pets atingido para o plano gratuito.');
      }
    }

    return await prisma.pet.create({ data: createPetDto });
  }

  async findAll({ clinicId }: { clinicId: number }) {
    const users = await prisma.pet.findMany({
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
    return await prisma.pet.findUnique({
      where: { id, userId, clinicId },
      include: { user: true, clinic: true },
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
      throw new Error('Clinica não autorizada.');
    }
    return await prisma.pet.delete({ where: { id, clinicId } });
  }

  async update(id: number, data: CreatePetDto) {
    const plan = await prisma.clinic.findUnique({
      where: { id: data.clinicId },
      select: { plan: true },
    });

    if (!plan) {
      throw new Error('Clínica não encontrada.');
    }
    if (plan.plan?.type === 'FREE') {
      throw new Error('Clinica não autorizada.');
    }
    return await prisma.pet.update({ where: { id }, data });
  }
}
