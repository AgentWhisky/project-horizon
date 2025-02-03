import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 30, nullable: true })
  name: string;

  @ManyToMany(() => RoleEntity)
  @JoinTable({ name: 'user_roles' })
  roles: RoleEntity[];

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'lastLogin', type: 'timestamp', nullable: true })
  lastLogin: Date;

  // *** CREDENTIALS ***
  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // HASHED PASSWORD
}
