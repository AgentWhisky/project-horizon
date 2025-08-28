import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

enum UpdateType {
  FULL = 'F',
  INRECMENTAL = 'I',
}

export enum UpdateStatus {
  PREPARING = 'P',
  RUNNING = 'R',
  COMPLETE = 'C',
  FAILED = 'F',
  CANCELED = 'X',
}

@Entity('steam_update_history')
export class SteamUpdateHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'update_type', type: 'enum', enum: UpdateType, default: 'F' })
  updateType: UpdateType;

  @Index()
  @Column({ name: 'update_status', enum: UpdateStatus, default: 'P' })
  updateStatus: UpdateStatus;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz' })
  endTime: Date;

  @Column({ name: 'inserts_game', type: 'int', default: 0 })
  insertsGame: number;

  @Column({ name: 'updates_game', type: 'int', default: 0 })
  updatesGame: number;

  @Column({ name: 'inserts_dlc', type: 'int', default: 0 })
  insertsDlc: number;

  @Column({ name: 'updates_dlc', type: 'int', default: 0 })
  updatesDlc: number;

  @Column({ name: 'errors', type: 'int', default: 0 })
  errors: number;

  @Column({ name: 'notes', type: 'text' })
  notes: string;

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'created_date', type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamptz' })
  updatedDate: Date;
}
