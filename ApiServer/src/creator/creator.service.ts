import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { Schemas } from 'src/app.constants';
import { CreatorApplicationDto } from "./creatorApplication.dto";
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.schema';
import { CreatorApplicationDocument, CreatorApplicationStatus, CreatorApplication } from './creator.schema';
import { AttachmentService } from 'src/attachment/attachment.service';
import { TokenDocument } from 'src/auth/token.schema';
import { ConfigService } from 'src/config/config.service';
import { UserService } from 'src/user/user.service';
import { ObjectId } from 'mongodb';
import { ServiceBase } from 'src/common/serviceBase';
import * as sharp from 'sharp';

@Injectable()
export class CreatorService extends ServiceBase {
  constructor(@InjectModel(Schemas.Creator) private readonly creatorRepository: Model<CreatorApplicationDocument>,
              private readonly attachmentService: AttachmentService,
              private readonly sendgridService: SendGridService,
              private readonly jwtService: JwtService,
              @InjectModel(Schemas.Token) private readonly tokenRepository: Model<TokenDocument>,
              private readonly configService: ConfigService,
              private readonly userService: UserService) {
                super(CreatorService.name);
              }

  async addApplication(applicationData: CreatorApplicationDto, file: any, user: User): Promise<CreatorApplication> {
    const profiler = this.logger.startTimer();
    this.logger.debug('saving application');
    const creator = await new this.creatorRepository({...applicationData, user: user.id});
    if (file) {
      const croppedFile = await sharp(file.buffer)
        .resize(300, 300, {
          position: sharp.strategy.attention,
        }).toBuffer();
      const attachment = await this.attachmentService.create({
        filename: `${creator.id}-${file.originalname}`,
        contentType: file.mimetype
      }, {buffer: croppedFile});
      creator.profileImage = attachment;
    }

    await creator.save();
    this.logger.debug('application saved');
    const token = await this.jwtService.signAsync({ userId: user.id }, { notBefore: Date.now(), expiresIn: 43200 });
    await this.tokenRepository.create({userId: user.id, token});

    this.logger.debug('sending email');
    try {
      const appConfig = this.configService.get('app');
      await this.sendgridService.send({
        to: creator.email,
        from: 'verify@mol.ai',
        subject: 'Mol.ai Please verify email',
        text: `Your email verification token is ${token}`,
        html: `<strong>Click <a href="${appConfig.webappUrl}/projects/becomeCreator?token=${token}">here</a> to verify your email</strong>`
      })

      creator.status = CreatorApplicationStatus.awaitingEmailVerification;
      creator.save()
    } catch (error) {
      this.logger.error('Error sending verification email to user', error.toString());
    }
    
    profiler.done('Creator Application successfully saved')
    return creator.toObject();
  }

  async verifyEmail(token: string): Promise<boolean> {
    this.logger.debug('Attempting email verification');
    const savedToken = await this.tokenRepository.findOne({token: token});
    if (savedToken) {
      const creator = await this.creatorRepository.findOne({user: savedToken.userId});
      creator.status = CreatorApplicationStatus.awaitingVerification;
      await creator.save();
      await this.tokenRepository.deleteOne(savedToken);
      return true;
    } else {
      this.logger.debug('Email verification token not found or already expired');
      throw new ForbiddenException('Email verification token has expired');
    }
  }

  async getCreatorsAwaitingApproval(): Promise<CreatorApplication[]> {
    const result = await this.creatorRepository.find({status: CreatorApplicationStatus.awaitingVerification}).populate(Schemas.User);
    return result.map(r => r.toObject())
  }

  async getCreatorApplication(userId: string): Promise<CreatorApplication> {
    const result = await this.creatorRepository.findOne({user: userId});
    return (result) ? result.toObject() : undefined;
  }

  async approveApplication(id: string | ObjectId, user: User) {
    const application = await this.creatorRepository.findById(id);
    await this.userService.setUserDetails(application.user as string, application);
    application.status = CreatorApplicationStatus.accepted;
    application.reviewedBy = user.id;
    await application.save();
  }

  async rejectApplication(id: string, user: User) {
    const application = await this.creatorRepository.findById(id);
    application.status = CreatorApplicationStatus.rejected;
    application.reviewedBy = user.id;
    await application.save();
  }
}
