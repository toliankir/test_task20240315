import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'filename' })
  public readonly filename: string;

  @Column({ name: 'mime' })
  public readonly mime: string;

  @Column({ name: 'data', type: 'bytea' })
  public readonly data: Buffer;

  @Column({ name: 'message_id' })
  public readonly messageId: number;

  @Column({ name: 'utc_created_at', type: 'timestamp without time zone' })
  public readonly createdAt: Date;

  @ManyToOne(() => MessageEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'message_id', referencedColumnName: 'id' })
  public readonly message: MessageEntity;
}
