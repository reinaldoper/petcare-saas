import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateStockDto } from './dto/create-stock.dto';

const prisma = new PrismaClient();

@Injectable()
export class StockService {
  async create(data: CreateStockDto) {
    const { clinicId } = data;

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { plan: true },
    });

    if (!clinic) {
      throw new ForbiddenException('Clínica não encontrada.');
    }

    if (clinic.plan?.type === 'FREE') {
      const stockCount = await prisma.stock.count({
        where: { clinicId },
      });

      if (stockCount >= 50) {
        throw new ForbiddenException(
          'Limite de 50 itens no estoque atingido para o plano gratuito.',
        );
      }
    }
    return await prisma.stock.create({
      data: {
        name: data.name,
        quantity: data.quantity,
        type: data.type,
        validUntil: new Date(data.validUntil),
        clinicId: data.clinicId,
      },
    });
  }

  async findMany(clinicId: number) {
    return await prisma.stock.findMany({
      where: { clinicId },
      orderBy: { name: 'asc' },
      include: { clinic: true },
    });
  }

  async getStockById(id: number) {
    return await prisma.stock.findUnique({ where: { id } });
  }

  async remove(id: number) {
    return await prisma.stock.delete({ where: { id } });
  }

  async updateStock(id: number, data: CreateStockDto) {
    return await prisma.stock.update({ where: { id }, data });
  }
}
