import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { createPaymentDtoSchema } from './dto/zod.dto';
import { ApiTags } from '@nestjs/swagger';

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
  ) {
    const validation = createPaymentDtoSchema.safeParse(body);
    if (!validation.success) {
      throw new BadRequestException(validation.error.message);
    }
    return this.paymentsService.createSubscription(body.email);
  }

  @Post('pix')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createPixPayment(@Body() body: CreatePaymentDto) {
    const validation = createPaymentDtoSchema.safeParse(body);
    if (!validation.success) {
      throw new BadRequestException(validation.error.message);
    }
    return this.paymentsService.createPixPayment(body.email);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() body: Record<string, any>) {
    const { type, data } = body;
    const typeBody = type as 'payment' | 'subscription_preapproval';
    const dataId = data?.id?.toString?.() ?? String(data?.id);

    if (!typeBody || !dataId) {
      throw new BadRequestException('Dados inválidos');
    }

    return await this.paymentsService.UpdatePaymentDetails(dataId, typeBody);
  }

  @Patch('latest')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getLatestPayment(@Body() body: CreatePaymentDto) {
    const validation = createPaymentDtoSchema.safeParse(body);
    if (!validation.success) {
      throw new BadRequestException(validation.error.message);
    }
    return this.paymentsService.getPaymentByEmail(body.email);
  }
}
