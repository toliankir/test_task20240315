import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { FileEntity } from './file.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'name' })
  public readonly name: string;

  @Column({ name: 'email' })
  public readonly email: string;

  @Column({ name: 'homepage', nullable: true })
  public readonly homepage: string | null;

  @Column({ name: 'text' })
  public readonly text: string;

  @Column({ name: 'parent_message_id', nullable: true })
  public readonly parentMessageId: number;

  @Column({ name: 'utc_created_at', type: 'timestamp without time zone' })
  public readonly createdAt: Date;

  @OneToMany(() => FileEntity, ({ message }) => message)
  public readonly files: FileEntity[];

  @OneToOne(() => MessageEntity)
  @JoinColumn([{ name: 'parent_message_id', referencedColumnName: 'id' }])
  public readonly parentMessage?: MessageEntity;
}
