import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from './location/location.module';
import { DispatcherModule } from './dispatcher/dispatcher.module';
import { TripModule } from './trip/trip.module';
import { Trip } from './trip/entities/trip.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Trip],
      synchronize: true,
    }),
    LocationModule,
    DispatcherModule,
    TripModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
