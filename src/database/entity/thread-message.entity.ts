import { Entity, Column } from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('thread_messages')
export class ThreadMessageEntity extends MessageEntity {
  @Column({ name: 'path' })
  public readonly path: string;

  @Column({ name: 'thread_id' })
  public readonly threadId: number;
}
