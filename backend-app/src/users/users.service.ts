import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';
import { SocialLinkEntity } from './social-link.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly profileRepo: Repository<UserProfileEntity>,
    @InjectRepository(SocialLinkEntity)
    private readonly socialLinkRepo: Repository<SocialLinkEntity>,
  ) {}

  async getProfile(userId: number) {
    const profile = await this.profileRepo.findOne({
      where: { user_id: userId },
    });
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return {
      user_profile_id: Number(profile.user_profile_id),
      user_id: Number(profile.user_id),
      user_description: profile.user_description,
      photo_path: profile.photo_path,
      social_links: profile.socialLinks.map((sl) => ({
        social_link_id: Number(sl.social_link_id),
        link: sl.link,
        created_at: sl.created_at.toISOString(),
        modified_at: sl.modified_at.toISOString(),
      })),
    };
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    photo?: Express.Multer.File,
  ) {
    let profile = await this.profileRepo.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      profile = this.profileRepo.create({ user_id: userId });
    }

    if (dto.user_description !== undefined) {
      profile.user_description = dto.user_description;
    }
    if (photo) {
      profile.photo_path = `/uploads/${photo.filename}`;
    }

    await this.profileRepo.save(profile);
    return this.getProfile(userId);
  }

  async deleteProfile(userId: number) {
    const profile = await this.profileRepo.findOne({
      where: { user_id: userId },
    });
    if (profile) {
      await this.socialLinkRepo.delete({ user_profile_id: Number(profile.user_profile_id) });
      await this.profileRepo.remove(profile);
    }
  }

  async addSocialLink(userId: number, targetUserId: number, link: string) {
    if (userId !== targetUserId) {
      throw new ForbiddenException('Cannot add social links for another user');
    }

    let profile = await this.profileRepo.findOne({
      where: { user_id: userId },
    });
    if (!profile) {
      profile = await this.profileRepo.save(
        this.profileRepo.create({ user_id: userId }),
      );
    }

    const socialLink = this.socialLinkRepo.create({
      user_profile_id: Number(profile.user_profile_id),
      link,
    });
    return this.socialLinkRepo.save(socialLink);
  }

  async removeSocialLink(userId: number, targetUserId: number, linkId: number) {
    if (userId !== targetUserId) {
      throw new ForbiddenException(
        'Cannot remove social links for another user',
      );
    }

    const profile = await this.profileRepo.findOne({
      where: { user_id: userId },
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const link = await this.socialLinkRepo.findOne({
      where: {
        social_link_id: linkId,
        user_profile_id: Number(profile.user_profile_id),
      },
    });
    if (!link) {
      throw new NotFoundException('Social link not found');
    }

    await this.socialLinkRepo.remove(link);
  }
}
