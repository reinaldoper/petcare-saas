import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

@Injectable()
export class AlertService {
  constructor() {}

  async findUpcoming() {
    const now = new Date();
    const inSevenDays = addDays(now, 7);

    const results = await prisma.vaccineHistory.findMany({
      where: {
        appliedAt: {
          lt: inSevenDays,
        },
      },
      include: {
        pet: true,
      },
    });

    return results;
  }
}
