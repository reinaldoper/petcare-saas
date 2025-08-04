import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns';
import { AlertsGateway } from './alerts.gateway';

const prisma = new PrismaClient();

@Injectable()
export class AlertService {
  constructor(private readonly alertsGateway: AlertsGateway) {}

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

    this.alertsGateway.sendUpcomingAlert(results);

    return results;
  }
}
