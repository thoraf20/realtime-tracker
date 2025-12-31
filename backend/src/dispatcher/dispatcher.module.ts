import { Module } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';
import { DispatcherController } from './dispatcher.controller';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [LocationModule],
  providers: [DispatcherService],
  controllers: [DispatcherController],
  exports: [DispatcherService],
})
export class DispatcherModule {}
