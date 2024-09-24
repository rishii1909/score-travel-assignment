import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  email!: string;

  @Column()
  oryIdentityId!: string;

  @Column("text", { array: true })
  roles!: string[];
}
