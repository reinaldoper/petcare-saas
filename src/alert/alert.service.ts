import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

@Injectable()
export class AlertService {
  async findUpcoming() {
    const now = new Date();

    let inSevenDays: Date;

    try {
      const result = addDays(now, 7);

      if (isNaN(result.getTime())) {
        throw new Error('Falha ao calcular a data.');
      }

      inSevenDays = result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Erro para calcular a data: ' + error.message);
      }
      throw new Error('Erro para calcular a data: ' + String(error));
    }

    return await prisma.vaccineHistory.findMany({
      where: {
        appliedAt: {
          lt: inSevenDays,
        },
      },
      include: {
        pet: true,
      },
    });
  }
}
