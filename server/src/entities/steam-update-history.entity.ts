import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

import { SteamInsightUpdateStatus, SteamInsightUpdateType } from '@hz/common/enums';
import { SteamInsightUpdateStats } from '@hz/common/model';

@Entity('steam_update_history')
export class SteamUpdateHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'update_type', type: 'enum', enum: SteamInsightUpdateType, default: 'F' })
  updateType: SteamInsightUpdateType;

  @Index()
  @Index('steam_app_update_running_unique', { synchronize: false })
  @Column({ name: 'update_status', enum: SteamInsightUpdateStatus, default: 'R' })
  updateStatus: SteamInsightUpdateStatus;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz', nullable: true })
  endTime: Date;

  @Column({ name: 'stats', type: 'jsonb', nullable: true })
  stats: SteamInsightUpdateStats;

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
