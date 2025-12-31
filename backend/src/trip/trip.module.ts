import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { Trip } from './entities/trip.entity';
import { DispatcherModule } from '../dispatcher/dispatcher.module';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip]),
    DispatcherModule,
    LocationModule,
  ],
  providers: [TripService],
  controllers: [TripController],
})
export class TripModule {}
