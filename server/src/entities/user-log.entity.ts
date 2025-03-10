import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_logs')
export class UserLogEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'action' })
  action: string;

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'createdDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updatedDate', type: 'timestamp' })
  updatedDate: Date;
}
