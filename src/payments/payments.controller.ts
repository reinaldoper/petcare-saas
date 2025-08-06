import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { createPaymentDtoSchema } from './dto/zod.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('subscribe')
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
}
