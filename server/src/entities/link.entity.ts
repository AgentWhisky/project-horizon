import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { LinkTagEntity } from './link-tags.entity';
import { LinkCategoryEntity } from './link-categories.entity';

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

  @ManyToOne(() => LinkCategoryEntity, (category) => category.links, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: LinkCategoryEntity;

  @Column({ name: 'status', type: 'boolean', default: true })
  status: boolean;

  @ManyToMany(() => LinkTagEntity, (tag) => tag.links, { cascade: true })
  @JoinTable({
    name: 'link_library_tags',
    joinColumn: {
      name: 'link_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: LinkTagEntity[];

  @Column({ name: 'sort_key', type: 'text', default: '' })
  sortKey: string;

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'created_date', type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', type: 'timestamptz' })
  updatedDate: Date;
}
