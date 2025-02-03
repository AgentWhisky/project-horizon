import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class SettingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'setting', unique: true })
  setting: string;

  @Column({ name: 'value', type: 'text' })
  value: string;

  // *** AUDIT FIELDS ***
  @Column({ name: 'createdBy', type: 'int', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'createdDate', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'updatedBy', type: 'int', nullable: true })
  updatedBy: number;

  @UpdateDateColumn({ name: 'updatedDate', type: 'timestamp' })
  updatedDate: Date;
}
