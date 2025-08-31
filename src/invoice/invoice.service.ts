import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async generatePdf(appointmentId: number): Promise<Buffer> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        pet: true,
        clinic: true,
      },
    });
    if (!appointment) throw new NotFoundException('Agendamento não encontrado');

    const doc = new PDFDocument();
    const stream = new PassThrough();
    doc.pipe(stream);

    doc.fontSize(20).text('Nota Fiscal', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Cliente: ${appointment.pet.ownerName}`);
    doc.text(`Serviço: ${appointment.reason}`);
    doc.text(`Valor: R$ ${appointment.price}`);
    doc.text(`Data: ${new Date(appointment.date).toLocaleDateString('pt-BR')}`);
    doc.text(`Clínica: ${appointment.clinic.razaoSocial}`);
    doc.text(`CNPJ: ${appointment.clinic.cnpj}`);

    doc.end();

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }
}
