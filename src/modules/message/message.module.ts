import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageEntity } from 'src/database/entity/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entity/file.entity';
import { ThreadMessageEntity } from 'src/database/entity/thread-message.entity';
import { MessageResolver } from './message.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, ThreadMessageEntity, FileEntity]),
  ],
  providers: [MessageResolver, MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
