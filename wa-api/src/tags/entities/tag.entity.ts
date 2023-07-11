import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Event } from "src/events/entities/event.entity";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => User, (user) => user.tags)
  user: User;

  @OneToMany(() => Event, (event) => event.tag)
  events: Event[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
