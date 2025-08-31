import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

@ApiTags('invoice')
@UseGuards(JwtAuthGuard, RolesGuard)
@Throttle({ default: { limit: 5, ttl: 60 } })
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get(':appointmentId/pdf')
  async getInvoicePdf(
    @Param('appointmentId') appointmentId: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.invoiceService.generatePdf(appointmentId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=nota-fiscal-${appointmentId}.pdf`,
    });

    res.send(pdfBuffer);
  }
}
