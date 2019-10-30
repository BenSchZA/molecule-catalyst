import { Controller, Get, Param, Res, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { Stream } from 'stream';
import { AttachmentService } from './attachment.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { UserType } from 'src/user/user.schema';
import { FileInterceptorHelper, FileOptions } from 'src/helpers/fileInterceptorHelper';

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) { }

  @Get(':id')
  public async getFile(@Param('id') attachmentId: string): Promise<Buffer> {
    const result = await this.attachmentService.getFile(attachmentId);
    return result;
  }

  @Get(':id/b64') // Returns base64 image as string
  public async getFileBase64(@Param('id') attachmentId: string): Promise<any> {
    const buffer = await this.attachmentService.getFile(attachmentId);
    const result = buffer.toString('base64');
    return { result: result };
  }

  @Get(':id/stream')
  public async getFileStream(@Res() res: Response, @Param('id') attachmentId: string): Promise<Stream> {
    if (!attachmentId) return undefined;

    const contentType = await this.attachmentService.getFileContentType(attachmentId);
    res.set('Content-Type', contentType);
    const readStream = this.attachmentService.getFileStream(attachmentId);
    return readStream.pipe(res);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.ProjectCreator)
  @UseInterceptors(FileInterceptorHelper({
    maxCount: 1,
    name: 'file',
    type: FileOptions.PICTURE,
  }))
  public async uploadFile(@UploadedFile() file) {
    if (!file) throw new BadRequestException('No file provided in request');
    const result = await this.attachmentService.processImage(file);
    return result._id;
  }
}
