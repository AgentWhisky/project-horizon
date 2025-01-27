import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RightEntity } from './right.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 30, unique: true })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @ManyToMany(() => RightEntity)
  @JoinTable({ name: 'role_rights' })
  rights: RightEntity[];

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
