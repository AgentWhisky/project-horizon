import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum SteamAppChangeType {
  INSERT = 'I',
  UPDATE = 'U',
  DELETE = 'D',
}

@Entity('steam_app_audit')
export class SteamAppAuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'appid', type: 'int' })
  appid: number;

  @Index()
  @Column({ name: 'update_history_id', type: 'int' })
  updateHistoryId: number;

  @Column({ name: 'change_type', type: 'enum', enum: SteamAppChangeType })
  changeType: SteamAppChangeType;

  @Column({ name: 'changes', type: 'jsonb' })
  changes: Record<string, any>;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'created_date', type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamptz' })
  updatedDate: Date;
}
