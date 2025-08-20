import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('confirm')
  async confirm(@Body() body: { subscription_id: string }) {
    return this.subscriptionService.confirmSubscription(body.subscription_id);
  }

  @Post('cancel-subscription')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async cancel(@Body() body: { subscription_id: string }) {
    return this.subscriptionService.cancelSubscription(body.subscription_id);
  }
}
