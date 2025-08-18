import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MercadoPagoConfig, PreApproval, Payment } from 'mercadopago';
import { PrismaClient } from '@prisma/client';
import { PaymentGateway } from './payment.gateway';

const planId =
  process.env.MERCADO_PAGO_PLAN_ID || '1a8c6e8d-7b8c-4b8c-8b8c-8b8c8b8c8b8c';

const prisma = new PrismaClient();

@Injectable()
export class PaymentsService {
  private mercadopago: PreApproval;
  private mercadopix: Payment;

  constructor(private paymentGateway: PaymentGateway) {
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

      const redirectUrl = `https://site-retorno.vercel.app?subscription_id=${subscriptionId}`;

      return {
        init_point: response.init_point,
        redirectUrl,
        subscriptionId,
      };
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
  }

  async createPixPayment(email: string) {
    const paymentData = {
      transaction_amount: 109.9,
      description: 'Pagamento via Pix',
      payment_method_id: 'pix',
      payer: {
        email,
      },
    };

    const response = await this.mercadopix.create({ body: paymentData });

    return {
      qrCode: response.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64:
        response.point_of_interaction?.transaction_data?.qr_code_base64,
      paymentId: response.id,
      status: response.status,
    };
  }

  async getPaymentDetails(paymentId: string) {
    if (!paymentId) {
      throw new BadRequestException('Payment ID inválido');
    }

    try {
      const response = await this.mercadopix.get({ id: paymentId });

      if (!response || !response.id) {
        throw new NotFoundException('Pagamento não encontrado no Mercado Pago');
      }

      const clinic = await prisma.clinic.findFirst({
        where: {
          users: {
            some: {
              email: response.payer?.email,
            },
          },
        },
      });

      if (!clinic) {
        return { received: false, reason: 'Clínica não encontrada' };
      }
      const existingPayment = await prisma.payment.findUnique({
        where: { paymentId: response.id },
      });

      if (!existingPayment) {
        await prisma.payment.create({
          data: {
            paymentId: response.id,
            status: response.status || 'pending',
            method: response.payment_method?.type || '',
            amount: response.transaction_amount || 0,
            payerEmail: response.payer?.email || '',
          },
        });
      }
      this.paymentGateway.notifyClinicPaymentUpdate(clinic.id, {
        paymentId: response.id,
        status: response.status,
        amount: response.transaction_amount,
      });

      return { received: response.status === 'approved' };
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error);
      throw new BadRequestException('Erro ao processar pagamento');
    }
  }
}
