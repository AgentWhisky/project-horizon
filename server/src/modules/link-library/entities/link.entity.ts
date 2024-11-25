import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinTable, ManyToMany } from "typeorm";
import { LinkTagEntity } from "./link-tags.entity";

@Entity("links")
export class LinkEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name", type: "varchar", length: 256 })
  name: string;

  @Column({ name: "description", type: "text" })
  description: string;

  @Column({ name: "url", type: "varchar", length: 256 })
  url: string;

  @Column({ name: "category", type: "varchar", length: 32 })
  category: string;

  @Column({ name: "status", type: "char", length: 1, default: "A" })
  status: "A" | "I";

  @ManyToMany(() => LinkTagEntity, (tag) => tag.links)
  @JoinTable({ name: "link_library_tags" })
  tags: LinkTagEntity[];

  @Column({ name: "thumbnail", type: "varchar", length: 512, nullable: true })
  thumbnail?: string;

  @Column({ name: "click_count", type: "int", default: 0 })
  clickCount: number;

  @CreateDateColumn({ name: "last_updated", type: "timestamp" })
  lastUpdated: Date;
}
