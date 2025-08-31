import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { VaccineHistoryModule } from './vaccine-history/vaccine-history.module';
import { StockModule } from './stock/stock.module';
import { AlertModule } from './alert/alert.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClinicModule } from './clinic/clinic.module';
import { PetsModule } from './pets/pets.module';
import { PaymentsModule } from './payments/payments.module';
import { PlanModule } from './plan/plan.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionModule } from './subscription/subscription.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    AppointmentModule,
    VaccineHistoryModule,
    StockModule,
    AlertModule,
    UsersModule,
    AuthModule,
    ClinicModule,
    PetsModule,
    PaymentsModule,
    PlanModule,
    SubscriptionModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
