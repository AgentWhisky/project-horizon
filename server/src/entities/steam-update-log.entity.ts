import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('steam_update_logs')
export class SteamUpdateLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz' })
  endTime: Date;

  @Column({ name: 'success_count', type: 'int' })
  successCount: number;

  @Column({ name: 'failure_count', type: 'int' })
  failureCount: number;

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
