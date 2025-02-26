import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from './profile.entity';

export enum UserRole {
  USER = 'user',
  OWNER = 'owner',
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;
}
