import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 30, unique: true })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 30 })
  email: string;

  @ManyToMany(() => RoleEntity)
  @JoinTable({ name: 'user_roles' })
  roles: RoleEntity[];

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'lastLogin', type: 'timestamp', nullable: true })
  lastLogin: Date;

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
