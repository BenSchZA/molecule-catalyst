import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { Stream } from 'stream';
import { AttachmentService } from './attachment.service';

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
    return {result: result};
  }

  @Get(':id/stream')
  public async getFileStream(@Res() res: Response, @Param('id') attachmentId: string): Promise<Stream> {
    if (!attachmentId) return undefined;
     
    const contentType = await this.attachmentService.getFileContentType(attachmentId);
    res.set('Content-Type', contentType);
    const readStream = this.attachmentService.getFileStream(attachmentId);
    return readStream.pipe(res);
  }
}
