import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('thread_messages')
export class ThreadMessageEntity {
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

  @Column({ name: 'path' })
  public readonly path: string;

  @Column({ name: 'thread_id' })
  public readonly threadId: number;

  @Column({ name: 'files', type: 'jsonb', nullable: true })
  public readonly files: [] | null;
}
