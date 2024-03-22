import { Injectable, Logger } from '@nestjs/common';
import { UploadRequestDto } from './dto/upload.request';
import { Job, Queue } from 'bull';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { MessageService } from '../message/message.service';
import { UploadFile } from './types/file';
import { ConfigService } from '@nestjs/config';
import { DeepPartial, Repository } from 'typeorm';
import { FileEntity } from 'src/database/entity/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetFileRequestDto } from './dto/get-file.request';
import { UploadFileJobData } from './types/file-job';
import { imageSize } from 'image-size';
import tinify from 'tinify';
import Source from 'tinify/lib/tinify/Source';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
@Processor(FileService.FILE_UPLOAD_QUEUE)
export class FileService {
  public static ALLOWED_IMAGE_FILE_TYPES = ['image/jpeg', 'image/png'];
  public static ALLOWED__FILE_TYPES = ['text/plain'];
  private static MAX_IMAGE_WIDTH = 320;
  private static MAX_IMAGE_HEIGHT = 240;
  public static FILE_UPLOAD_QUEUE = 'file_upload_qeueu';
  public static FILE_UPLOADED = 'FILE_UPLOADED';
  private readonly logger = new Logger(FileService.name);
  private readonly tinifyApiKey: string;
  public readonly pubSub: PubSub;

  constructor(
    @InjectQueue(FileService.FILE_UPLOAD_QUEUE)
    private readonly fileUploadQueue: Queue,
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {
    const tinifyApiKey = this.configService.get<string>('TINIFY_API_KEY');

    if (!tinifyApiKey) {
      throw new Error('Miscofiguration TINIFY_API_KEY must be set');
    }
    this.tinifyApiKey = tinifyApiKey;
    this.pubSub = new PubSub();
  }

  public async upload(data: UploadRequestDto, file: UploadFile): Promise<void> {
    const jobData: UploadFileJobData = {
      messageId: data.messageId,
      filename: file.filename,
      mime: file.mime,
      data: file.data.toString('base64'),
    };
    await this.fileUploadQueue.add(jobData);
  }

  public async getFile(data: GetFileRequestDto): Promise<UploadFile> {
    const file: FileEntity = await this.fileRepository.findOneOrFail({
      where: {
        messageId: data.messageId,
        filename: data.filename,
      },
    });

    return {
      filename: file.filename,
      mime: file.mime,
      data: file.data,
    };
  }

  @Process()
  private async uploadFileProcess(job: Job<UploadFileJobData>) {
    try {
      try {
        await this.messageService.getMessage(job.data.messageId);
      } catch (e) {
        this.logger.warn(`Message ${job.data.messageId} does not exist`);
        throw e;
      }

      let fileBuffer: Buffer = Buffer.from(job.data.data, 'base64');

      if (FileService.ALLOWED_IMAGE_FILE_TYPES.includes(job.data.mime)) {
        const imageFileSize = imageSize(fileBuffer);

        if (
          imageFileSize.width > FileService.MAX_IMAGE_WIDTH ||
          imageFileSize.height > FileService.MAX_IMAGE_HEIGHT
        ) {
          this.logger.verbose(
            `File ${job.data.filename} ${imageFileSize.width}x${imageFileSize.height} require resize`,
          );
          tinify.default.key = this.tinifyApiKey;
          const imageSource = tinify.fromBuffer(fileBuffer);
          const resizedImage: Source = imageSource.resize({
            method: 'fit',
            width: FileService.MAX_IMAGE_WIDTH,
            height: FileService.MAX_IMAGE_HEIGHT,
          });

          fileBuffer = Buffer.from(await resizedImage.toBuffer());
        }
      }

      const newFileEntity: DeepPartial<FileEntity> = {
        messageId: job.data.messageId,
        filename: job.data.filename,
        mime: job.data.mime,
        data: fileBuffer,
      };

      await this.fileRepository.save(newFileEntity);

      this.logger.verbose(
        `Uploaded file ${job.data.filename}, ${job.data.mime}`,
      );
      this.pubSub.publish(FileService.FILE_UPLOADED, {
        messageId: job.data.messageId,
        filename: job.data.filename,
        mime: job.data.mime,
      });
    } catch (e) {
      this.logger.error('message' in e ? e.message : e.toString());
    }
  }
}
