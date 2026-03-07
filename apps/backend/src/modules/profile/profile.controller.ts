import {
  Controller,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProfileService } from './profile.service';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  getMe(@Request() req: { user: { sub: string } }) {
    return this.profileService.getMe(req.user.sub);
  }

  @Put('avatar')
  @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage() }))
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: { user: { sub: string } },
  ) {
    return this.profileService.uploadAvatar(req.user.sub, file);
  }
}
