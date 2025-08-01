import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePetDto } from './dto/create-pet';

const prisma = new PrismaClient();
@Injectable()
export class PetsService {
  async create(createPetDto: CreatePetDto) {
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

  async remove(id: number) {
    return await prisma.pet.delete({ where: { id } });
  }

  async update(id: number, data: CreatePetDto) {
    return await prisma.pet.update({ where: { id }, data });
  }
}
