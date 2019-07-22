import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { Schemas } from '../app.constants';

@Injectable()
export class UserService {
  constructor(@InjectModel(Schemas.User) private readonly userRepository: Model<UserDocument>) {}

  async create(ethAddress: string): Promise<User> {
    const newUser = await new this.userRepository({ethAddress});
    await newUser.save();
    return newUser.toObject();
  }

  async getUserByEthAddress(ethAddress: string): Promise<User> {
    const user = await this.userRepository.findOne({ethAddress: ethAddress.toLowerCase()});
    return user ? user.toObject() : false;
  }

  // async findByEmail(email: string): Promise<UserDocument> {
  //   return await this.userRepository.findOne({ email }).select('password');
  // }

  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    return user ? user.toObject() : false;
  }
}
