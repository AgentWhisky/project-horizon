import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { LinkTagEntity } from './link-tags.entity';
import { LinkCategoryEntity } from './link-categories.entity';

@Entity('links')
export class LinkEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 256, unique: true })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'url', type: 'varchar', length: 256, unique: true })
  url: string;

  @ManyToOne(() => LinkCategoryEntity, (category) => category.links)
  category: LinkCategoryEntity;

  @Column({ name: 'status', type: 'char', length: 1, default: 'A' })
  status: 'A' | 'I';

  @ManyToMany(() => LinkTagEntity, (tag) => tag.links, { cascade: true })
  @JoinTable({ name: 'link_library_tags' })
  tags: LinkTagEntity[];

  @Column({ name: 'thumbnail', type: 'varchar', length: 512, nullable: true })
  thumbnail?: string;

  @Column({ name: 'click_count', type: 'int', default: 0 })
  clickCount: number;

  @CreateDateColumn({ name: 'last_updated', type: 'timestamp' })
  lastUpdated: Date;
}
