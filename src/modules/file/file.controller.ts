import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Logger,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import { UploadResponseDto } from './dto/upload.response';
import { ApiResponse } from '@nestjs/swagger';
import { UploadRequestDto } from './dto/upload.request';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetFileRequestDto } from './dto/get-file.request';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('file')
export class FileController {
  private static MAX_FILE_SIZE = 100000;
  private readonly logger = new Logger(FileController.name);

  constructor(private readonly fileService: FileService) { }

  @ApiResponse({ type: UploadResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadRequestDto,
  ): Promise<UploadResponseDto> {
    if (!file || Array.isArray(file)) {
      throw new BadRequestException();
    }

    if (file.size > FileController.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Maximum file size - ${FileController.MAX_FILE_SIZE} bytes`,
      );
    }

    const allowedTypes = [
      ...FileService.ALLOWED_IMAGE_FILE_TYPES,
      ...FileService.ALLOWED__FILE_TYPES,
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      this.logger.warn(`Unexpected file type ${file.mimetype}`);
      throw new BadRequestException(
        `Allowed file types - ${allowedTypes.join(',')}`,
      );
    }

    this.fileService.upload(body, {
      filename: file.originalname,
      mime: file.mimetype,
      data: file.buffer,
    });

    return {
      success: true,
    };
  }

  @Get(':messageId/:filename')
  @Header('Content-Type', 'image/jpeg')
  public async getFile(
    @Param() data: GetFileRequestDto,
    @Res() response: Response,
  ): Promise<any> {
    const file = await this.fileService.getFile(data);
    response.set({ 'Content-Type': file.mime });
    response.end(file.data, 'binary');
  }
}
