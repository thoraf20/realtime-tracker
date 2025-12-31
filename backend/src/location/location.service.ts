import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class LocationService implements OnModuleInit {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not defined');
    }
    this.redisClient = new Redis(redisUrl);
  }

  async updateDriverLocation(driverId: string, lat: number, lng: number): Promise<void> {
    // GeoAdd: key, longitude, latitude, member
    await this.redisClient.geoadd('drivers', lng, lat, driverId);
    // Also store raw data for metadata if needed, but GEO is enough for position
  }

  async getNearbyDrivers(lat: number, lng: number, radiusKm: number): Promise<any[]> {
    return this.redisClient.georadius('drivers', lng, lat, radiusKm, 'km', 'WITHDIST', 'WITHCOORD');
  }
}
