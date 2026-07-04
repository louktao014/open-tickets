import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  emitMessage(channelId: string, data: any) {
    this.server.to(channelId).emit('new-message', data);
  }
}
