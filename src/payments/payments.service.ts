import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const planId =
  process.env.MERCADO_PAGO_PLAN_ID || '1a8c6e8d-7b8c-4b8c-8b8c-8b8c8b8c8b8c';

@Injectable()
export class PaymentsService {
  private mercadopago: PreApproval;

  constructor() {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    });

    this.mercadopago = new PreApproval(client);
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
}
