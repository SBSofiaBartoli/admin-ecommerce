import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, avatarUrl: true },
    });
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const url = await this.cloudinary.uploadImage(file);
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: url },
      select: { id: true, email: true, avatarUrl: true },
    });
  }
}
