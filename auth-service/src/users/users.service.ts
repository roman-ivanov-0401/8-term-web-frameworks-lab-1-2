import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { user_id: id } });
  }

  async create(dto: {
    user_name: string;
    email: string;
    password_hash: string;
  }): Promise<User> {
    const user = this.usersRepo.create(dto);
    const savedUser = await this.usersRepo.save(user);

    await this.profileRepo.save(
      this.profileRepo.create({ user_id: Number(savedUser.user_id) }),
    );

    return savedUser;
  }
}
