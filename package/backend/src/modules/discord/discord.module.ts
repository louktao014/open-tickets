import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { GatewayModule } from '../gateway/gateway.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [GatewayModule, MessageModule],
  providers: [DiscordService],
})
export class DiscordModule {}
