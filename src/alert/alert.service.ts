import { Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertService {
  constructor(private readonly prisma: PrismaService) {}

  async findUpcoming() {
    const now = new Date();
    const inSevenDays = addDays(now, 7);

    const results = await this.prisma.vaccineHistory.findMany({
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
