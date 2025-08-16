import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class PaymentGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinClinicRoom')
  handleJoinRoom(
    @MessageBody() clinicId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`clinic-${clinicId}`);
    console.log(`Socket ${client.id} entrou na sala clinic-${clinicId}`);
  }

  notifyClinicPaymentUpdate(clinicId: number, data: any) {
    this.server.to(`clinic-${clinicId}`).emit('paymentUpdated', data);
  }
}
