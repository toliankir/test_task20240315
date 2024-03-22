import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageEntity } from 'src/database/entity/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadMessageEntity } from 'src/database/entity/thread-message.entity';
import { MessageResolver } from './message.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, ThreadMessageEntity])],
  providers: [MessageResolver, MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
