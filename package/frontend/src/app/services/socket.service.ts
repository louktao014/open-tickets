import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

export interface DiscordMessage {
  channel_id: string;
  author: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  socket = io('http://localhost:3000');

  join(channelId: string) {
    this.socket.emit('join', channelId);
  }

  onMessage(cb: (message: DiscordMessage) => void) {
    this.socket.on('new-message', cb);
  }
}
