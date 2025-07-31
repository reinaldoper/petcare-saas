import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateStockDto } from './dto/create-stock.dto';

const prisma = new PrismaClient();

@Injectable()
export class StockService {
  async create(data: CreateStockDto) {
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

  async findAll() {
    return await prisma.stock.findMany({
      orderBy: { name: 'asc' },
      include: { clinic: true },
    });
  }

  async findOne(id: number) {
    return await prisma.stock.findUnique({ where: { id } });
  }
}
