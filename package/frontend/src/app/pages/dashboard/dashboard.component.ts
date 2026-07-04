import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService, DiscordMessage } from '../../services/socket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  messages: DiscordMessage[] = [];

  constructor(private socket: SocketService) {}

  ngOnInit() {
    const channelId = 'YOUR_CHANNEL_ID';

    this.socket.join(channelId);

    this.socket.onMessage((msg: DiscordMessage) => {
      if (msg.channel_id === channelId) {
        this.messages.unshift(msg);
      }
    });
  }
}
