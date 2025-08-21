import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { createPaymentDtoSchema } from './dto/zod.dto';
import { ApiTags } from '@nestjs/swagger';
import { WebhookDto } from './dto/create-webhook.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('subscribe')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async subscribe(
    @Body()
    body: {
      email: CreatePaymentDto['email'];
    },
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
  async createPixPayment(@Body() body: { email: CreatePaymentDto['email'] }) {
    const validation = createPaymentDtoSchema.safeParse(body);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    return this.paymentsService.createPixPayment(body.email);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() body: WebhookDto) {
    const paymentId = body.data?.id;

    const paymentDetails =
      await this.paymentsService.getPaymentDetails(paymentId);

    return paymentDetails;
  }
}
