import { Tag } from "src/tags/entities/tag.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  comment: string;

  @Column()
  data: string;

  @ManyToOne(() => Tag, (tag) => tag.events)
  tag: Tag;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
