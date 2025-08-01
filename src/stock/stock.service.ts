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

  async findMany(clinicId: number) {
    return await prisma.stock.findMany({
      where: { clinicId },
      orderBy: { name: 'asc' },
      include: { clinic: true },
    });
  }
}
