import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('rights')
export class RightEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 30, unique: true })
  name: string;

  @Column({ name: 'internalName', type: 'varchar', length: 30, unique: true })
  internalName: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @ManyToMany(() => RoleEntity, (role) => role.rights)
  roles: RoleEntity[];

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
