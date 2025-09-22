import { BadRequestException, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment, PreApproval } from 'mercadopago';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  private mercadopago: PreApproval;
  private mercadoPix: Payment;
  constructor(private readonly prisma: PrismaService) {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    });

    this.mercadopago = new PreApproval(client);
    this.mercadoPix = new Payment(client);
  }

  async confirmSubscription(subscriptionId: string) {
    const subscriptionDetails = await this.mercadopago.get({
      id: subscriptionId,
    });

    const data = subscriptionDetails;

    await this.prisma.subscription.create({
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

  async conforimPayment(payment: string) {
    const subscriptionDetails = await this.mercadoPix.get({
      id: payment,
    });

    const data = subscriptionDetails;

    await this.prisma.subscription.create({
      data: {
        status: data.status || 'active',
        lastModified: new Date(data.date_created || new Date()),
        nextPaymentDate: new Date(data.date_approved || new Date()),
        initPoint: data.callback_url || '',
        applicationId: data.id || 1,
        reason: 'Assinatura Pix',
        payerEmail: data.payer?.email || '',
        payerId: Number(data.payer?.id) || 1,
        subscriptionId: data.id?.toString() || '',
        dateCreated: new Date(data.date_created || new Date()),
        collectorId: data.collector_id || 1,
        backUrl:
          data.callback_url || 'https://github.com/reinaldoper/site-retorno',
        autoRecurring: {
          create: {
            frequency: 1,
            frequencyType: 'months',
            transactionAmount: 109.9,
            currencyId: 'BRL',
          },
        },
      },
    });

    return {
      status: data.status || 'pending',
      subscription_id: data.id || '',
    };
  }

  async cancelSubscription(subscriptionId: string) {
    if (!subscriptionId) {
      throw new BadRequestException('Subscription ID inválido');
    }

    try {
      const response = await this.mercadopago.update({
        id: subscriptionId,
        body: {
          status: 'cancelled',
        },
      });

      if (!response) {
        throw new BadRequestException('Erro ao cancelar assinatura');
      }

      const existingSubscription = await this.prisma.subscription.findFirst({
        where: { subscriptionId },
      });

      if (!existingSubscription) {
        throw new BadRequestException('Assinatura não encontrada');
      }
      await this.prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: { status: 'cancelled' },
      });

      const existUser = await this.prisma.user.findUnique({
        where: { email: existingSubscription.payerEmail || '' },
      });
      if (existUser) {
        const plan = await this.prisma.plan.findFirst({
          where: { clinicId: existUser.clinicId },
        });
        if (plan?.type !== 'FREE') {
          await this.prisma.plan.update({
            where: { id: plan?.id },
            data: { type: 'FREE' },
          });
        }
      }
      return {
        cancelled: response.status === 'cancelled',
        subscriptionId,
        clinicId: existUser?.clinicId,
        newPlanType: 'FREE',
        message: 'Assinatura cancelada com sucesso',
      };
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw new BadRequestException('Erro ao cancelar assinatura');
    }
  }
}
