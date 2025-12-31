import { Module } from '@nestjs/common';
import { LocationGateway } from './location/location.gateway';
import { LocationService } from './location.service';

@Module({
  providers: [LocationGateway, LocationService],
  exports: [LocationService, LocationGateway],
})
export class LocationModule {}
