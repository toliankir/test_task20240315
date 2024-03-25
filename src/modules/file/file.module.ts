import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { BullModule } from '@nestjs/bull';
import { MessageModule } from '../message/message.module';
import { FileEntity } from 'src/database/entity/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileResolver } from './file.resolver';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    BullModule.registerQueue({ name: FileService.FILE_UPLOAD_QUEUE }),
    BullBoardModule.forFeature({
      name: FileService.FILE_UPLOAD_QUEUE,
      adapter: BullAdapter,
    }),
    TypeOrmModule.forFeature([FileEntity]),
    MessageModule,
  ],
  providers: [FileService, FileResolver],
  controllers: [FileController],
})
export class FileModule {}
