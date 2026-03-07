import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, AuthModule, CloudinaryModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
