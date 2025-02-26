import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../entity/users.entity';
import * as bcrypt from 'bcrypt';
import { MailerService } from '../config/mailer.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService
  ) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword });
    await this.userRepository.save(user);
    return { message: 'Registration successful, waiting for approval' };
  }

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new UnauthorizedException('Username and password are required');
    }

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.APPROVED) {
      throw new UnauthorizedException('Account not approved');
    }

    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { token };
  }

  async approveUser(id: string, username: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('User not found');
    user.status = UserStatus.APPROVED;
    user.username = username;
    await this.userRepository.save(user);
    await this.mailerService.sendApprovalEmail(user.email, username);
    return { message: 'User approved' };
  }
}
