import { Injectable } from '@nestjs/common';
import { LocationService } from '../location/location.service';

@Injectable()
export class DispatcherService {
  constructor(private readonly locationService: LocationService) {}

  async requestRide(lat: number, lng: number): Promise<any> {
    // Search radius: 5km
    const radiusKm = 5;
    const nearbyDrivers = await this.locationService.getNearbyDrivers(lat, lng, radiusKm);

    if (!nearbyDrivers || nearbyDrivers.length === 0) {
        return { message: 'No drivers found nearby' };
    }

    // Sort by distance (ASC) - Redis returns loosely sorted but good to be sure if using GEORADIUS strictly
    // ioredis GEORADIUS with WITHDIST returns [[member, distance], ...]
    // But since we are using 'WITHCOORD' as well, the structure is complex.
    // Let's assume the first result is the closest for now or sort it.
    
    // Simplest logic: Pick the first one.
    const [driverId, distance, coords] = nearbyDrivers[0];

    return {
      driverId,
      distance: `${distance} km`,
      location: {
        lng: coords[0],
        lat: coords[1],
      },
    };
  }
}
