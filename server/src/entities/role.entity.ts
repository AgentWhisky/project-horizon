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

  @ManyToMany(() => RightEntity, (right) => right.roles, { cascade: true })
  @JoinTable({
    name: 'role_rights',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'right_id',
      referencedColumnName: 'id',
    },
  })
  rights: RightEntity[];

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'created_date', type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamptz' })
  updatedDate: Date;
}
