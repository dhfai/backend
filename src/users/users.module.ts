import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entity/users.entity';
import { MailerModule } from '../config/mailer.module';
import { AuthModule } from '../auth/auth.module'; // ✅ Tambahkan import
import { Profile } from 'src/entity/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    MailerModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
