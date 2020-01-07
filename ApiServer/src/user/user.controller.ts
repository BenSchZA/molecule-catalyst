import { Controller, UseGuards, Get, Param, Patch, UseInterceptors, Body, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { User, UserType } from './user.schema';
import { AuthGuard } from '@nestjs/passport';
import { FileOptions, FileInterceptorHelper } from 'src/helpers/fileInterceptorHelper';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Admin)
  async getAllUsers(): Promise<User[]> {
    const result = await this.userService.getAllUsers();
    return result;
  }

  @Get(':id/promoteToAdmin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Admin)
  async promoteToAdmin(@Param('id') userId: string): Promise<User> {
    const result = await this.userService.promoteToAdmin(userId);
    return result;
  }
  
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Admin)
  @UseInterceptors(FileInterceptorHelper({
    name: 'profileImage',
    maxCount: 1,
    type: FileOptions.PICTURE,
  }))
  async updateUser(@Param('id') userId: string, @Body() body, @UploadedFile() file) {
    const result = this.userService.updateUser(userId, body, file);
    return result;
  }
}
