import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly port: number;
  constructor(private configService: ConfigService) {
    this.port = this.configService.get('PORT')!;
  }

  getHello(): string {
    console.log(this.port);
    return `Hello World! Port: ${this.port}`;
  }
}
