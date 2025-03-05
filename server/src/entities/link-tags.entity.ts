import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { LinkEntity } from "./link.entity";

@Entity("link_tags")
export class LinkTagEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name", type: "varchar", length: 64, unique: true })
  name: string;

  @ManyToMany(() => LinkEntity, (link) => link.tags)
  links: LinkEntity[];
}
