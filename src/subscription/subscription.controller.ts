import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('confirm')
  async confirm(@Body() body: { subscription_id: string }) {
    return this.subscriptionService.confirmSubscription(body.subscription_id);
  }
}
