import { Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertService {
  constructor(private readonly prisma: PrismaService) {}

  async findUpcoming(clinicId: number) {
    const now = new Date();
    const inSevenDays = addDays(now, 7);

    return await this.prisma.vaccineHistory.findMany({
      where: {
        appliedAt: {
          lt: inSevenDays,
        },
        pet: {
          clinicId,
        },
      },
      include: {
        pet: true,
      },
    });
  }

  async getAllClinicIds(): Promise<number[]> {
    const clinics = await this.prisma.clinic.findMany({ select: { id: true } });
    return clinics.map((c) => c.id);
  }
}
