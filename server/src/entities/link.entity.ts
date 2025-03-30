import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinTable, ManyToMany, ManyToOne, UpdateDateColumn } from 'typeorm';
import { LinkTagEntity } from './link-tags.entity';
import { LinkCategoryEntity } from './link-categories.entity';
import { LINK_DESC_MAX_LENGTH, LINK_NAME_MAX_LENGTH } from 'src/common/constants/validation.constants';

@Entity('links')
export class LinkEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;

  @Column({ name: 'url', type: 'varchar', length: 2048, unique: true })
  url: string;

  @ManyToOne(() => LinkCategoryEntity, (category) => category.links)
  category: LinkCategoryEntity;

  @Column({ name: 'status', type: 'enum', enum: ['A', 'I'], default: 'A' })
  status: 'A' | 'I';

  @ManyToMany(() => LinkTagEntity, (tag) => tag.links, { cascade: true })
  @JoinTable({ name: 'link_library_tags' })
  tags: LinkTagEntity[];

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'createdDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updatedDate', type: 'timestamp' })
  updatedDate: Date;
}
