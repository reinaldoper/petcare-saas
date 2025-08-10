import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class PaymentGateway {
  @WebSocketServer()
  server: Server;

  notifyPaymentUpdate(data: any) {
    this.server.emit('paymentUpdated', data);
  }
}
