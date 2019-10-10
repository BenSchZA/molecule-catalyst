import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ObjectId } from 'bson';
import { Model, Mongoose } from 'mongoose';
import * as gridfs from 'mongoose-gridfs';
import { Modules, Schemas } from 'src/app.constants';
import { Stream } from 'stream';
import * as streamifier from 'streamifier';
import { Attachment, AttachmentDocument } from './attachment.schema';
import { ServiceBase } from 'src/common/serviceBase';
import sharp = require('sharp');

@Injectable()
export class AttachmentService extends ServiceBase {
  private readonly attachmentGridFsRepository: any; // This is used to access the binary data in the files
  private readonly attachmentRepository: Model<AttachmentDocument>; // This is used to access file metadata

  constructor(@InjectConnection() private readonly mongooseConnection: Mongoose) {
    super(AttachmentService.name);
    this.attachmentGridFsRepository = gridfs({
      collection: 'attachments',
      model: Schemas.Attachment,
      mongooseConnection: this.mongooseConnection,
    });

    this.attachmentRepository = this.attachmentGridFsRepository.model;
  }

  public async create(options: { filename: string, contentType: string }, file: { buffer: Buffer }): Promise<Attachment> {
    this.logger.debug('Creating new attachment');
    try {
      const fileStream = streamifier.createReadStream(file.buffer);
      const result = new Promise<Attachment>((resolve, reject) => {
        this.attachmentGridFsRepository.write(options, fileStream, (error, fileDocument: Attachment) => {
          resolve(fileDocument);
          reject(error);
        });
      });
      return await result;
    } catch (error) {
      this.logger.error(`Error saving new attachment: ${error.message}`);
    }
  }

  public async processImage(file): Promise<Attachment> {
    this.logger.debug('Resizing and saving image');
    try {
      const croppedFile = await sharp(file.buffer)
        .resize(null, null, {
          width: 1014,
          withoutEnlargement: true,
        }).toBuffer();

      const fileStream = streamifier.createReadStream(croppedFile.buffer);
      const result = new Promise<Attachment>((resolve, reject) => {
        this.attachmentGridFsRepository.write({
          filename: `${file.originalname}`,
          contentType: file.mimetype
        }, 
        fileStream, 
        (error, fileDocument: Attachment) => {
          resolve(fileDocument);
          reject(error);
        });
      });
      return await result;
    } catch (error) {
      this.logger.error(`Error saving new attachment: ${error.message}`);
    }
  }

  public async getFile(attachmentId: string): Promise<Buffer> {
    this.logger.debug(`Getting attachment ${attachmentId}`);
    // TODO: Check file metadata to ensure that memory usage does not skyrocket if trying to return a big file
    try {
      const result = new Promise<Buffer>((resolve, reject) => {
        this.attachmentGridFsRepository.readById(new ObjectId(attachmentId), (error: Error, content: Buffer) => {
          resolve(content);
          reject(error);
        });
      });

      return result;
    } catch (e) {
      this.logger.error(e);
    }
  }

  public getFileStream(attachmentId: string): Stream {
    const readStream = this.attachmentGridFsRepository.readById(new ObjectId(attachmentId)) as Stream;
    return readStream;
  }

  public async getFileContentType(attachmentId: string): Promise<string> {
    const result = await this.attachmentRepository.findById(attachmentId, 'contentType', { lean: true });
    return result.contentType;
  }

  public async delete(attachment: string | ObjectId | AttachmentDocument): Promise<boolean> {
    const idToDelete = (attachment instanceof ObjectId) ? attachment :
      (typeof (attachment) === 'string') ? new ObjectId(attachment) : attachment._id;
    const result = new Promise<boolean>((resolve, reject) => {
      this.attachmentGridFsRepository.unlinkById(idToDelete, (error, unlinkedAttachment) => {
        resolve(true);
        reject(false);
      });
    });

    return await result;
  }
}
