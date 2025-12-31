import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip, TripStatus } from './entities/trip.entity';
import { DispatcherService } from '../dispatcher/dispatcher.service';
import { LocationGateway } from '../location/location/location.gateway';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
    private dispatcherService: DispatcherService,
    private locationGateway: LocationGateway,
  ) {}

  async createTrip(request: { pickupLat: number; pickupLng: number }) {
    // Find a driver
    const match = await this.dispatcherService.requestRide(request.pickupLat, request.pickupLng);
    
    if (!match.driverId) {
      throw new Error('No drivers available');
    }

    // Create Trip
    const trip = this.tripsRepository.create({
      pickupLat: request.pickupLat,
      pickupLng: request.pickupLng,
      driverId: match.driverId,
      passengerId: `passenger-${Date.now()}`, // simple demo ID
      status: TripStatus.ACCEPTED, // Auto-accept for demo
    });

    const savedTrip = await this.tripsRepository.save(trip);
    
    // Notify Driver/Passenger
    this.locationGateway.server.emit('tripUpdate', savedTrip);
    
    return savedTrip;
  }

  async setTripStatus(id: string, status: TripStatus) {
    const trip = await this.tripsRepository.findOne({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');

    trip.status = status;
    const updatedTrip = await this.tripsRepository.save(trip);
    
    this.locationGateway.server.emit('tripUpdate', updatedTrip);
    
    return updatedTrip;
  }

  async driverArrived(id: string) {
    return this.setTripStatus(id, TripStatus.DRIVER_AT_PICKUP);
  }

  async startTrip(id: string) {
    return this.setTripStatus(id, TripStatus.IN_PROGRESS);
  }

  async completeTrip(id: string) {
    return this.setTripStatus(id, TripStatus.COMPLETED);
  }

  async findAll() {
    return this.tripsRepository.find();
  }
}
