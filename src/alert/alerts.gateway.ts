import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
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

  private cachedAlerts: any[] | null = null;

  constructor(private readonly alertService: AlertService) {}

  afterInit() {
    setInterval(() => {
      this.checkUpcomingAlerts();
    }, 86400000);
  }

  //teste

  private async checkUpcomingAlerts() {
    const upcomingAlerts = await this.alertService.findUpcoming();

    if (!this.areEqual(upcomingAlerts, this.cachedAlerts)) {
      this.cachedAlerts = upcomingAlerts;
      this.server.emit('upcoming-alert', upcomingAlerts);
    } else {
      console.log('Nenhuma alteração nos alertas, não emitindo.');
    }
  }

  private areEqual(arr1: any[] | null, arr2: any[] | null): boolean {
    if (arr1 === arr2) return true;
    if (arr1 == null || arr2 == null) return false;
    try {
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    } catch {
      return false;
    }
  }
}
