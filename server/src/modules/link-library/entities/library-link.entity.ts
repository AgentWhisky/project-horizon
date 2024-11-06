import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('link_library')
export class LibraryLinkEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'url', type: 'varchar', length: 500 })
  url: string;

  @Column({ name: 'category', type: 'varchar', length: 100 })
  category: string;

  @Column({ name: 'status', type: 'char', length: 1, default: 'A' })
  status: 'A' | 'I';

  @Column({ name: 'tags', type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ name: 'thumbnail', type: 'varchar', length: 500, nullable: true })
  thumbnail?: string;

  @Column({ name: 'click_count', type: 'int', default: 0 })
  clickCount: number;

  @CreateDateColumn({ name: 'last_updated', type: 'timestamp' })
  lastUpdated: Date;
}
