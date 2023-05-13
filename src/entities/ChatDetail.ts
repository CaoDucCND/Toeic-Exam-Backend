import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chat } from "./Chat";

@Index("chat_detail_fk0", ["idChat"], {})
@Entity("chat_detail", { schema: "toeic_exam" })
export class ChatDetail {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "id_chat" })
  idChat: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("datetime", { name: "time_chat" })
  timeChat: Date;

  @ManyToOne(() => Chat, (chat) => chat.chatDetails, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_chat", referencedColumnName: "idStudent" }])
  idChat2: Chat;
}
