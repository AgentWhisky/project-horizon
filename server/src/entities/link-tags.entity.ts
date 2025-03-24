import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LinkEntity } from './link.entity';

@Entity('link_tags')
export class LinkTagEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255, unique: true })
  name: string;

  @ManyToMany(() => LinkEntity, (link) => link.tags)
  links: LinkEntity[];

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'createdDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updatedDate', type: 'timestamp' })
  updatedDate: Date;
}
