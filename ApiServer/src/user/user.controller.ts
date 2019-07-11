import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';

import passport = require('passport');

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    const result = await this.userService.create(createUserDto);
    return result.email;
  }
}
