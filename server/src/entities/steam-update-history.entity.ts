import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

import { UpdateStatus, UpdateType } from '@hz/common/enums';

@Entity('steam_update_history')
export class SteamUpdateHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'update_type', type: 'enum', enum: UpdateType, default: 'F' })
  updateType: UpdateType;

  @Index()
  @Index('steam_app_update_running_unique', { synchronize: false })
  @Column({ name: 'update_status', enum: UpdateStatus, default: 'R' })
  updateStatus: UpdateStatus;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz', nullable: true })
  endTime: Date;

  @Column({ name: 'inserts_game', type: 'int', nullable: true })
  insertsGame: number;

  @Column({ name: 'updates_game', type: 'int', nullable: true })
  updatesGame: number;

  @Column({ name: 'no_change_game', type: 'int', nullable: true })
  noChangeGame: number;

  @Column({ name: 'inserts_dlc', type: 'int', nullable: true })
  insertsDlc: number;

  @Column({ name: 'updates_dlc', type: 'int', nullable: true })
  updatesDlc: number;

  @Column({ name: 'no_change_dlc', type: 'int', nullable: true })
  noChangeDlc: number;

  @Column({ name: 'errors', type: 'int', nullable: true })
  errors: number;

  @Column({ name: 'events', type: 'text', array: true, default: () => "'{}'" })
  events: string[];

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'created_date', type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamptz' })
  updatedDate: Date;
}
