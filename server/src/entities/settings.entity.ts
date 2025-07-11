import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('settings')
export class SettingEntity {
  @PrimaryColumn({ name: 'key' })
  key: string;

  @Column({ name: 'value', type: 'text' })
  value: string;

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'created_date', type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamptz' })
  updatedDate: Date;
}
