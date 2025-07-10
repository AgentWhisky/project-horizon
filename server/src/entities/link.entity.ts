import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinTable, ManyToMany, ManyToOne, UpdateDateColumn } from 'typeorm';
import { LinkTagEntity } from './link-tags.entity';
import { LinkCategoryEntity } from './link-categories.entity';
import { MAX_SORT_STR_LENGTH } from 'src/common/constants/validation.constants';

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
  category: LinkCategoryEntity;

  @Column({ name: 'status', type: 'boolean', default: true })
  status: boolean;

  @ManyToMany(() => LinkTagEntity, (tag) => tag.links, { cascade: true })
  @JoinTable({ name: 'link_library_tags' })
  tags: LinkTagEntity[];

  @Column({
    name: 'sortKey',
    type: 'varchar',
    length: MAX_SORT_STR_LENGTH,
    default: 'zzz',
    transformer: {
      to: (value: string) => value?.toLowerCase() ?? '',
      from: (value: string) => value,
    },
  })
  sortKey: string;

  // *** AUDIT FIELDS ***
  @CreateDateColumn({ name: 'createdDate', type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updatedDate', type: 'timestamp' })
  updatedDate: Date;
}
