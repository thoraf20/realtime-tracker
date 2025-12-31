import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LocationService } from '../location.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly locationService: LocationService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(client: Socket, payload: { driverId: string; lat: number; lng: number }) {
    await this.locationService.updateDriverLocation(payload.driverId, payload.lat, payload.lng);
    // Broadcast to all admins (or everyone for demo)
    this.server.emit('driverMoved', payload);
    return { status: 'ok' };
  }
}
