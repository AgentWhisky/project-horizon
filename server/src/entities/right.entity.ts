import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('rights')
export class RightEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 30, unique: true })
  name: string;

  @Column({ name: 'internal_name', type: 'varchar', length: 30, unique: true, update: false })
  internalName: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @ManyToMany(() => RoleEntity, (role) => role.rights)
  roles: RoleEntity[];

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'created_date', type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamptz' })
  updatedDate: Date;
}
