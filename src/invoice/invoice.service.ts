import { Injectable, NotFoundException } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async generatePdf(appointmentId: number): Promise<Buffer> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: Number(appointmentId) },
      include: {
        pet: true,
        clinic: true,
      },
    });
    if (!appointment) throw new NotFoundException('Agendamento não encontrado');

    const doc = new PDFDocument({ margin: 50 });
    const stream = new PassThrough();
    doc.pipe(stream);

    doc.image('src/assets/logo.jpg', 50, 40, { width: 80 });
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(appointment.clinic.razaoSocial, 150, 40);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`CNPJ: ${appointment.clinic.cnpj}`, 150, 60)
      .text(
        `Data de emissão: ${new Date().toLocaleDateString('pt-BR')}`,
        150,
        75,
      );

    doc.moveDown(2);

    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text('Nota Fiscal de Serviço Veterinário', { align: 'center' });

    doc.moveDown(1);

    doc
      .fillColor('#000')
      .fontSize(12)
      .font('Helvetica')
      .rect(50, doc.y, 500, 120)
      .stroke();

    const boxTop = doc.y + 10;

    doc.text(`Cliente:`, 60, boxTop);
    doc.text(`${appointment.pet.ownerName}`, 150, boxTop);

    doc.text(`Serviço:`, 60, boxTop + 20);
    doc.text(`${appointment.reason}`, 150, boxTop + 20);

    doc.text(`Valor:`, 60, boxTop + 40);
    doc.text(`R$ ${appointment.price}`, 150, boxTop + 40);

    doc.text(`Data da consulta:`, 60, boxTop + 60);
    doc.text(
      `${new Date(appointment.date).toLocaleDateString('pt-BR')}`,
      150,
      boxTop + 60,
    );

    doc.moveDown(6);

    doc
      .fontSize(10)
      .fillColor('#555')
      .text(
        'Esta nota fiscal é válida como comprovante de serviço veterinário.',
        { align: 'center' },
      );

    doc.moveDown(2);
    doc
      .fontSize(12)
      .fillColor('#000')
      .text('Assinatura: ____________________________', { align: 'center' });

    doc.end();

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }
}
