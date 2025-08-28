import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(clinicId: number) {
    const appointments = await this.prisma.appointment.findMany({
      where: { clinicId: Number(clinicId) },
      select: { date: true },
    });
    const users = await this.prisma.user.findMany({
      where: { clinicId: Number(clinicId) },
      select: { createdAt: true },
    });
    const stock = await this.prisma.stock.findMany({
      where: { clinicId: Number(clinicId) },
      select: { type: true, totalPrice: true },
    });

    const agendamentosPorMes = this.agruparPorMes(
      appointments.map((a) => a.date),
    );

    const clientesPorMes = this.agruparPorMes(users.map((u) => u.createdAt));

    const estoquePorTipo: Record<string, number> = {};
    stock.forEach((item) => {
      if (item.totalPrice !== null && item.totalPrice !== undefined) {
        estoquePorTipo[item.type] =
          (estoquePorTipo[item.type] || 0) + Number(item.totalPrice.toFixed(2));
      }
    });

    return {
      agendamentosPorMes,
      clientesPorMes,
      estoquePorTipo,
    };
  }

  private agruparPorMes(datas: Date[]): number[] {
    const meses = Array(12).fill(0);
    datas.forEach((data) => {
      const mes = new Date(data).getMonth();
      meses[mes]++;
    });
    return meses as number[];
  }
}
