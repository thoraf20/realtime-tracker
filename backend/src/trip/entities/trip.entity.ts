import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TripStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  DRIVER_AT_PICKUP = 'DRIVER_AT_PICKUP',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  passengerId: string;

  @Column()
  driverId: string;

  @Column({
    type: 'simple-enum',
    enum: TripStatus,
    default: TripStatus.REQUESTED,
  })
  status: TripStatus;

  @Column('decimal', { precision: 10, scale: 6 })
  pickupLat: number;

  @Column('decimal', { precision: 10, scale: 6 })
  pickupLng: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  dropoffLat: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  dropoffLng: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
