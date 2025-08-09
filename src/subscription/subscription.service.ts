import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SubscriptionService {
  private mercadopago: PreApproval;
  constructor() {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    });

    this.mercadopago = new PreApproval(client);
  }

  async confirmSubscription(subscriptionId: string) {
    const subscriptionDetails = await this.mercadopago.get({
      id: subscriptionId,
    });

    const data = subscriptionDetails;

    await prisma.subscription.create({
      data: {
        subscriptionId: data.id || '',
        payerId: data.payer_id || 1,
        payerEmail: data.payer_email,
        status: data.status || 'active',
        reason: data.reason || 'Assinatura mensal',
        dateCreated: new Date(data.date_created || new Date()),
        lastModified: new Date(data.last_modified || new Date()),
        nextPaymentDate: new Date(
          data.auto_recurring?.frequency_type || new Date(),
        ),
        initPoint: data.init_point || '',
        applicationId: data.application_id || 1,
        collectorId: data.collector_id || 1,
        backUrl: data.back_url || 'https://github.com/reinaldoper/site-retorno',
        autoRecurring: {
          create: {
            frequency: data.auto_recurring?.frequency || 1,
            frequencyType: data.auto_recurring?.frequency_type || 'months',
            transactionAmount: data.auto_recurring?.transaction_amount || 49.9,
            currencyId: data.auto_recurring?.currency_id || 'BRL',
          },
        },
      },
    });

    return {
      status: data.status || 'pending',
      subscription_id: data.id || '',
    };
  }
}
