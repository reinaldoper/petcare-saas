import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AlertService } from './alert.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class AlertsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private cachedAlerts: Record<number, any[]> = {};

  constructor(private readonly alertService: AlertService) {}

  afterInit() {
    setInterval(() => {
      this.checkUpcomingAlerts();
    }, 86400000);
  }

  @SubscribeMessage('join-clinic')
  handleJoinClinic(
    @MessageBody() clinicId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`clinic-${clinicId}`);
    console.log(`Cliente conectado à sala clinic-${clinicId}`);
  }

  private async checkUpcomingAlerts() {
    const clinics = await this.alertService.getAllClinicIds();

    for (const clinicId of clinics) {
      const alerts = await this.alertService.findUpcoming(clinicId);

      const cached = this.cachedAlerts[clinicId] ?? [];

      if (!this.areEqual(alerts, cached)) {
        this.cachedAlerts[clinicId] = alerts;
        this.server.to(`clinic-${clinicId}`).emit('upcoming-alert', alerts);
        console.log(`Emitindo alertas para clinic-${clinicId}`);
      } else {
        console.log(`Sem mudanças para clinic-${clinicId}`);
      }
    }
  }

  private areEqual(arr1: any[], arr2: any[]): boolean {
    try {
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    } catch {
      return false;
    }
  }
}
