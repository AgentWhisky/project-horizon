import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { LinkEntity } from "./link.entity";

@Entity("link_categories")
export class LinkCategoryEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name", type: "varchar", length: 64 })
  name: string;

  @Column({ name: "description", type: "varchar", length: 256 })
  description: string;

  @OneToMany(() => LinkEntity, (link) => link.category)
  links: LinkEntity[];
}
