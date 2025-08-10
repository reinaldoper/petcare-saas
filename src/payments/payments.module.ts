import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentGateway } from './payment.gateway';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentGateway],
  exports: [PaymentGateway],
})
export class PaymentsModule {}
