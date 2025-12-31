import { IsNumber, Min, Max } from 'class-validator';

export class CreateTripDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  pickupLat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  pickupLng: number;
}
