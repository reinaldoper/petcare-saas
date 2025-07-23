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
        throw new Error('Failed to calculate date 7 days from now.');
      }

      inSevenDays = result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error calculating date: ' + error.message);
      }
      throw new Error('Error calculating date: ' + String(error));
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
