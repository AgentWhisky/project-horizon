import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

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
  @Index({ unique: true })
  @Column({
    transformer: {
      to: (value: string) => value?.toLowerCase() ?? '',
      from: (value: string) => value,
    },
  })
  username: string;

  @Column()
  password: string; // HASHED PASSWORD

  @OneToMany(() => RefreshTokenEntity, (token) => token.user)
  refreshTokens: RefreshTokenEntity[];

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'createdDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updatedDate', type: 'timestamp' })
  updatedDate: Date;
}
