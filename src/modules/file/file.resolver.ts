import { Resolver, Subscription } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUploadedResponseDto } from './dto/file-uploaded.response.dto';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Subscription(() => FileUploadedResponseDto, {
    name: 'fileUploaded',
    resolve: (v) => v,
  })
  public messageAdded() {
    return this.fileService.pubSub.asyncIterator(FileService.FILE_UPLOADED);
  }
}
