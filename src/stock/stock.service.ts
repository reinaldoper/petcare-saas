import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateStockDto } from './dto/create-stock.dto';

const prisma = new PrismaClient();

@Injectable()
export class StockService {
  async create(data: CreateStockDto) {
    return await prisma.stock.create({ data });
  }

  async findAll() {
    return await prisma.stock.findMany();
  }

  async findOne(id: number) {
    return await prisma.stock.findUnique({ where: { id } });
  }
}
