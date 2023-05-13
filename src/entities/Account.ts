import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "./Admin";
import { Student } from "./Student";

@Entity("account", { schema: "toeic_exam" })
export class Account {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "username", length: 255 })
  username: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "phone", nullable: true, length: 255 })
  phone: string | null;

  @Column("int", { name: "dob", nullable: true })
  dob: number | null;

  @Column("enum", { name: "role", enum: ["STUDENT", "ADMIN"] })
  role: "STUDENT" | "ADMIN";

  @OneToMany(() => Admin, (admin) => admin.idAccount2)
  admins: Admin[];

  @OneToMany(() => Student, (student) => student.idAccount2)
  students: Student[];
}
