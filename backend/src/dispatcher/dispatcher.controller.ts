import { Body, Controller, Post } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';
import { RequestRideDto } from './dto/request-ride.dto';

@Controller('dispatcher')
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}

  @Post('request')
  async requestRide(@Body() body: RequestRideDto) {
    return this.dispatcherService.requestRide(body.lat, body.lng);
  }
}
