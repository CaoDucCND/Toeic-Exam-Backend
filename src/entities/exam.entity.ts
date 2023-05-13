import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FullTest } from "./fullTest.entity";
import { Part } from "./part.entity";

@Entity("exam", { schema: "toeic_exam" })
export class Exam {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  description: string | null;

  @Column("datetime", { name: "create_at", nullable: true })
  createAt: Date | null;

  @Column("datetime", { name: "update_at", nullable: true })
  updateAt: Date | null;

  @OneToMany(() => FullTest, (fullTest) => fullTest.exam)
  fullTests: FullTest[];

  @OneToMany(() => Part, (part) => part.exam)
  parts: Part[];
}
