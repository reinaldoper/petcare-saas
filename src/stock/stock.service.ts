import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateStockDto) {
    const { clinicId } = data;

    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { plan: true },
    });

    if (!clinic) {
      throw new ForbiddenException('Clínica não encontrada.');
    }

    if (clinic.plan?.type === 'FREE') {
      const stockCount = await this.prisma.stock.count({
        where: { clinicId },
      });

      if (stockCount >= 50) {
        throw new ForbiddenException(
          'Limite de 50 itens no estoque atingido para o plano gratuito.',
        );
      }
    }
    const totalPrice = data.price ? data.price * data.quantity : undefined;
    return await this.prisma.stock.create({
      data: {
        name: data.name,
        quantity: data.quantity,
        type: data.type,
        validUntil: new Date(data.validUntil),
        clinicId: data.clinicId,
        price: data.price,
        totalPrice,
      },
    });
  }

  async findMany(clinicId: number) {
    return await this.prisma.stock.findMany({
      where: { clinicId },
      orderBy: { name: 'asc' },
      include: { clinic: true },
    });
  }

  async getStockById(id: number) {
    return await this.prisma.stock.findUnique({ where: { id } });
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

    const stock = await this.prisma.stock.findFirst({
      where: { id, clinicId },
    });

    if (!stock) {
      throw new Error('Estoque não encontrado ou não pertence à clínica.');
    }

    return await this.prisma.stock.delete({
      where: { id },
    });
  }

  async updateStock(id: number, data: CreateStockDto) {
    const totalPrice = data.price ? data.price * data.quantity : undefined;
    return await this.prisma.stock.update({
      where: { id },
      data: {
        name: data.name,
        quantity: data.quantity,
        type: data.type,
        validUntil: new Date(data.validUntil),
        clinicId: data.clinicId,
        price: data.price,
        totalPrice: totalPrice,
      },
    });
  }
}
