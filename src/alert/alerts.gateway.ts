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
  constructor(private readonly alertService: AlertService) {}

  afterInit() {
    setInterval(() => {
      this.checkUpcomingAlerts();
    }, 60000);
  }

  private async checkUpcomingAlerts() {
    const upcomingAlerts = await this.alertService.findUpcoming();
    this.server.emit('upcoming-alert', upcomingAlerts);
    console.log('Emiti upcoming-alert via Gateway');
  }
}
