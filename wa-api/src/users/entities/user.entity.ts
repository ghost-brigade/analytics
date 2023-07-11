import { Tag } from "src/tags/entities/tag.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  company: string;

  @Column()
  phone: string;

  @Column()
  baseUrl: string;

  @Column({ default: false })
  adminVerified: boolean;

  @Column({ default: "user" })
  role: "admin" | "user";

  @Column({ nullable: true })
  appId: string;

  @Column({ nullable: true })
  appSecret: string;

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
