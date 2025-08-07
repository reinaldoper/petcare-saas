import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const planId = process.env.MERCADO_PAGO_PLAN_ID || '';

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
      body: {
        plan_id: planId,
        payer_email: payerEmail,
        back_url: 'saasexpo://assinatura/sucesso',
      },
    };

    const response = await this.mercadopago.create(subscriptionData);
    return response;
  }
}
