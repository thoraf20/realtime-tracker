import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripStatus } from './entities/trip.entity';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.createTrip(createTripDto);
  }

  @Get()
  findAll() {
    return this.tripService.findAll();
  }

  @Post(':id/arrive')
  arrive(@Param('id') id: string) {
    return this.tripService.driverArrived(id);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string) {
    return this.tripService.completeTrip(id);
  }
}
