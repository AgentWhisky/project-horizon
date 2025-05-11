import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('steam_update_logs')
export class SteamUpdateLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz' })
  endTime: Date;

  @Column({ name: 'success_count', type: 'int', default: 0 })
  successCount: number;

  @Column({ name: 'failure_count', type: 'int', default: 0 })
  failureCount: number;

  @Column({ name: 'created_game_count', type: 'int', default: 0 })
  createdGameCount: number;

  @Column({ name: 'created_dlc_count', type: 'int', default: 0 })
  createdDlcCount: number;

  @Column({ name: 'updated_game_count', type: 'int', default: 0 })
  updatedGameCount: number;

  @Column({ name: 'updated_dlc_count', type: 'int', default: 0 })
  updatedDlcCount: number;

  @Column({ name: 'success_appids', type: 'int', array: true, nullable: true })
  successAppIds: number[];

  @Column({ name: 'failure_appids', type: 'int', array: true, nullable: true })
  failureAppIds: number[];

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'created_date', type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamptz' })
  updatedDate: Date;
}
