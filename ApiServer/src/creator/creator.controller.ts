import { Controller, Post, UseGuards, Body, UseInterceptors, UploadedFile, Req, Get, Param } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatorApplicationDto } from './creatorApplication.dto';
import { FileOptions, FileInterceptorHelper } from 'src/helpers/fileInterceptorHelper';
import { User, UserType } from 'src/user/user.schema';
import { CreatorApplication } from './creator.schema';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Request } from 'express';

@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) { }

  @Post('apply')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptorHelper({
    name: 'profileImage',
    maxCount: 1,
    type: FileOptions.PICTURE,
  }))
  async createApplication(@Req() req: Request & { user: User },
    @Body() reqBody: CreatorApplicationDto,
    @UploadedFile() file) {
    const result = await this.creatorService.addApplication(reqBody, file, req.user);
    return result;
  }

  @Post('verifyEmail')
  @UseGuards(AuthGuard('jwt'))
  async verifyEmailForUser(@Body() requestBody: {token: string}, @Req() request: Request & {user: User}) {
    const result = await this.creatorService.verifyEmail(requestBody.token);
    return result;
  }

  @Get('awaitingApproval')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Admin)
  async getCreatorsAwaitingApproval(): Promise<CreatorApplication[]> {
    const result = await this.creatorService.getCreatorsAwaitingApproval();
    return result;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getApplication(@Req() request: Request & {user: User}) {
    const result = await this.creatorService.getCreatorApplication(request.user.id)
    return result;
  }

  @Get(':id/approve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Admin)
  async approveCreatorApplication(@Param('id') id, @Req() req: Request & {user: User}) {
    const result = await this.creatorService.approveApplication(id, req.user);
  }

  @Get(':id/reject')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.Admin)
  async rejectCreatorApplication(@Param('id') id, @Req() req: Request & {user: User}) {
    const result = await this.creatorService.rejectApplication(id, req.user);
  }
}
