import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserType } from './user.schema';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { Schemas } from '../app.constants';
import { ObjectId } from 'mongodb';
import { Attachment } from 'src/attachment/attachment.schema';
import { ServiceBase } from 'src/common/serviceBase';

@Injectable()
export class UserService extends ServiceBase {

  constructor(@InjectModel(Schemas.User) private readonly userRepository: Model<UserDocument>) {
    super(UserService.name);
  }

  async create(ethAddress: string): Promise<User> {
    this.logger.debug('Creating new user');
    const profiler = this.logger.startTimer();
    const newUser = await new this.userRepository({ethAddress});
    await newUser.save();
    profiler.done('Created new user');
    return newUser.toObject();
  }

  async getAllUsers(): Promise<User[]> {
    const result = await this.userRepository.find({}).populate(Schemas.User);
    return result.map(r => r.toObject())
  }

  async getUserByEthAddress(ethAddress: string): Promise<User> {
    const user = await this.userRepository.findOne({ethAddress: ethAddress.toLowerCase()});
    return user ? user.toObject() : false;
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    return user ? user.toObject() : false;
  }

  async setUserType(userId: string, userType: UserType) {
    const user = await this.userRepository.findById(userId);
    user.type = userType;
    await user.save();
  }

  async setUserDetails(userId: string, details: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string | ObjectId | Attachment,
    biography: string,
    professionalTitle: string,
    affiliatedOrganisation: string,
  }) {
    const user = await this.userRepository.findById(userId);
    user.firstName = details.firstName;
    user.lastName = details.lastName;
    user.email = details.email;
    user.profileImage = details.profileImage;
    user.biography = details.biography;
    user.professionalTitle = details.professionalTitle;
    user.affiliatedOrganisation = details.affiliatedOrganisation;
    user.type = UserType.ProjectCreator;
    user.valid = true;
    await user.save();
  }

  async promoteToAdmin(userId: string): Promise<User> {
    this.logger.info(`Promoting user to admin: ${userId}`);
    const user = await this.userRepository.findById(userId);
    user.type = UserType.Admin;
    user.save();
    return user.toObject();
  }
}
