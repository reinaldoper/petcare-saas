import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { createPaymentDtoSchema } from './dto/zod.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('subscribe')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async subscribe(
    @Body()
    body: CreatePaymentDto,
  ): Promise<Promise<any>> {
    const validation = createPaymentDtoSchema.safeParse(body);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    return this.paymentsService.createSubscription(body.email);
  }

  @Post('pix')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createPixPayment(@Body() body: CreatePaymentDto) {
    const validation = createPaymentDtoSchema.safeParse(body);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    return this.paymentsService.createPixPayment(body.email);
  }
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<void> {
    const { type, data } = body;
    const typeBody = type as 'payment' | 'subscription_preapproval';
    const dataId = (data as { id: string })?.id;

    if (!typeBody || !dataId) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Dados inválidos' });
      return;
    }

    const paymentDetails = await this.paymentsService.getPaymentDetails(
      dataId,
      typeBody,
    );

    res.status(HttpStatus.OK).json(paymentDetails);
  }
}
