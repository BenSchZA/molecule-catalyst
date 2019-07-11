import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { Schemas } from '../app.constants';

@Injectable()
export class UserService {
  constructor(@InjectModel(Schemas.User) private readonly userRepository: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDTO): Promise<User> {
    const createdUser = new this.userRepository(createUserDto);
    return await createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return await this.userRepository.findOne({ email }).select('password');
  }

  async findById(userId: string): Promise<UserDocument> {
    return await this.userRepository.findById(userId);
  }
}
