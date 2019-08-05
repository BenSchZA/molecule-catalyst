import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { CreatorApplicationDto } from "./creatorApplication.dto";
import { User, UserType } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Schemas } from 'src/app.constants';
import { Model } from 'mongoose';
import { CreatorApplicationDocument, CreatorApplicationStatus, CreatorApplication } from './creator.schema';
import { AttachmentService } from 'src/attachment/attachment.service';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { JwtService } from '@nestjs/jwt';
import { TokenDocument } from 'src/auth/token.schema';
import { ConfigService } from 'src/config/config.service';
import { UserService } from 'src/user/user.service';
import { ObjectId } from 'bson';

@Injectable()
export class CreatorService {
  constructor(@InjectModel(Schemas.Creator) private readonly creatorRepository: Model<CreatorApplicationDocument>,
              private readonly attachmentService: AttachmentService,
              private readonly sendgridService: SendGridService,
              private readonly jwtService: JwtService,
              @InjectModel(Schemas.Token) private readonly tokenRepository: Model<TokenDocument>,
              private readonly configService: ConfigService,
              private readonly userService: UserService) { }

  async addApplication(applicationData: CreatorApplicationDto, file: any, user: User): Promise<CreatorApplication> {
    console.log('saving application');
    const creator = await new this.creatorRepository({...applicationData, user: user.id});
    if (file) {
      const attachment = await this.attachmentService.create({
        filename: `${creator.id}-${file.originalname}`,
        contentType: file.mimetype
      }, file);
      creator.profileImage = attachment;
    }

    await creator.save();

    const token = await this.jwtService.signAsync({ userId: user.id }, { notBefore: Date.now(), expiresIn: 43200 });
    await this.tokenRepository.create({userId: user.id, token});

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
      console.log('Error sending verification email to user');
    }    
    return creator.toObject();
  }

  async verifyEmail(token: string): Promise<boolean> {
    const savedToken = await this.tokenRepository.findOne({token: token});
    if (savedToken) {
      const creator = await this.creatorRepository.findOne({user: savedToken.userId});
      creator.status = CreatorApplicationStatus.awaitingVerification;
      await creator.save();
      await this.tokenRepository.deleteOne(savedToken);
      return true;
    } else {
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
    
    await this.userService.setUserType(application.user as string, UserType.ProjectCreator);
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
