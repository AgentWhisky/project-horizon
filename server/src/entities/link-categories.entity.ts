import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LinkEntity } from './link.entity';

@Entity('link_categories')
export class LinkCategoryEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;

  @OneToMany(() => LinkEntity, (link) => link.category)
  links: LinkEntity[];

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'createdDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updatedDate', type: 'timestamp' })
  updatedDate: Date;
}
