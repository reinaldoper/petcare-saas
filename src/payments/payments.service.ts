import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MercadoPagoConfig, PreApproval, Payment } from 'mercadopago';
import { PaymentGateway } from './payment.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes';
import { PreApprovalResponse } from 'mercadopago/dist/clients/preApproval/commonTypes';

const planId =
  process.env.MERCADO_PAGO_PLAN_ID || '1a8c6e8d-7b8c-4b8c-8b8c-8b8c8b8c8b8c';

@Injectable()
export class PaymentsService {
  private mercadopago: PreApproval;
  private mercadopix: Payment;

  constructor(
    private paymentGateway: PaymentGateway,
    private readonly prisma: PrismaService,
  ) {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    });

    this.mercadopago = new PreApproval(client);
    this.mercadopix = new Payment(client);
  }

  async createSubscription(payerEmail: string) {
    const subscriptionData = {
      plan_id: planId,
      payer_email: payerEmail,
      back_url: 'https://site-retorno.vercel.app',
      reason: 'Assinatura mensal',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: 49.9,
        currency_id: 'BRL',
      },
      notification_url: 'https://saas-6ufb.onrender.com/payments/webhook',
    };

    try {
      const response = await this.mercadopago.create({
        body: subscriptionData,
      });

      const subscriptionId = response.id;
      if (!subscriptionId) {
        throw new BadRequestException('Erro ao criar assinatura');
      }

      await this.prisma.payment.create({
        data: {
          paymentId: Number(subscriptionId),
          payerEmail,
          status: response.status || 'pending',
          amount: response.auto_recurring?.transaction_amount || 0,
          method: 'subscription',
        },
      });
      return {
        init_point: response.init_point,
        subscriptionId,
      };
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
  }

  async createPixPayment(email: string) {
    const paymentData = {
      back_url: 'https://site-retorno.vercel.app',
      transaction_amount: 109.9,
      description: 'Pagamento via Pix',
      payment_method_id: 'pix',
      payer: {
        email,
      },
      notification_url: 'https://saas-6ufb.onrender.com/payments/webhook',
    };
    const response = await this.mercadopix.create({ body: paymentData });

    if (!response.id) {
      throw new BadRequestException('Erro ao criar pagamento');
    }
    await this.prisma.payment.create({
      data: {
        paymentId: response.id,
        payerEmail: email,
        status: response.status || 'pending',
        amount: response.transaction_amount || 0,
        method: response.payment_method_id || '',
      },
    });

    return {
      qrCode: response.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64:
        response.point_of_interaction?.transaction_data?.qr_code_base64,
      paymentId: response.id,
      status: response.status,
    };
  }

  async getPaymentDetails(
    subscriptionId: string,
    type: 'payment' | 'subscription_authorized_payment',
  ) {
    if (!subscriptionId?.trim()) {
      throw new BadRequestException('ID de pagamento inválido');
    }

    try {
      let response: PaymentResponse | PreApprovalResponse | null = null;
      let email = '';

      if (type === 'payment') {
        response = await this.mercadopix.get({ id: subscriptionId });
        const payment = await this.prisma.payment.findFirst({
          where: { paymentId: Number(subscriptionId) },
        });
        email = payment?.payerEmail || '';
      } else if (type === 'subscription_authorized_payment') {
        response = await this.mercadopago.get({ id: subscriptionId });
        const subscription = await this.prisma.payment.findFirst({
          where: { paymentId: Number(subscriptionId) },
        });
        email = subscription?.payerEmail || '';
      }

      if (!response?.id) {
        throw new NotFoundException('Pagamento não encontrado no Mercado Pago');
      }
      const clinic = await this.prisma.clinic.findFirst({
        where: {
          users: {
            some: { email: email ?? '' },
          },
        },
      });

      if (!clinic) {
        return { received: false, reason: 'Clínica não encontrada' };
      }
      let payment = await this.prisma.payment.findUnique({
        where: { paymentId: Number(response.id) },
      });

      if (!payment) {
        payment = await this.prisma.payment.create({
          data: {
            paymentId: Number(response.id),
            status: response.status ?? 'pending',
            method:
              'payment_method_id' in response
                ? (response.payment_method_id ?? '')
                : '',
            amount:
              'transaction_amount' in response
                ? (response.transaction_amount ?? 0)
                : 0,
            payerEmail: email ?? '',
          },
        });
      } else {
        payment = await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: response.status ?? payment.status,
            amount:
              'transaction_amount' in response
                ? response.transaction_amount || payment.amount
                : payment.amount,
            method:
              'payment_method_id' in response
                ? response.payment_method_id || payment.method
                : payment.method,
          },
        });
      }
      this.paymentGateway.notifyClinicPaymentUpdate(clinic.id, {
        paymentId: response.id,
        status: response.status ?? 'unknown',
        amount:
          'transaction_amount' in response
            ? (response.transaction_amount ?? 0)
            : 0,
      });

      return { received: response.status === 'approved' };
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error?.message || error);
      throw new BadRequestException('Erro ao processar pagamento');
    }
  }
}
