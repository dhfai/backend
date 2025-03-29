import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from 'src/entity/users.entity';
import { Profile } from 'src/entity/profile.entity';

export class CreateOwnerSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const userRepository = queryRunner.manager.getRepository(User);
      const profileRepository = queryRunner.manager.getRepository(Profile);

      const existingOwner = await userRepository.findOne({
        where: { email: 'dhfaisweet@gmail.com' },
      });

      if (existingOwner) {
        console.log('⚠ Owner sudah ada, tidak perlu di-seed ulang.');
        return;
      }

      const hashedPassword = await bcrypt.hash('dhfaisweet', 10);

      const owner = userRepository.create({
        email: 'dhfaisweet@gmail.com',
        password: hashedPassword,
        username: 'dhfai',
        role: UserRole.OWNER,
        status: UserStatus.APPROVED,
      });

      const savedOwner = await userRepository.save(owner);

      const ownerProfile = profileRepository.create({
        firstName: 'Admin',
        lastName: 'Owner',
        bio: 'Pemilik sistem',
        phone: '085757562962',
        avatar: 'https://i.pravatar.cc/150?img=1',
      });

      await profileRepository.save(ownerProfile);

      await queryRunner.commitTransaction();
      console.log('✅ Owner dan profile berhasil ditambahkan.');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Gagal menambahkan owner:', error.message);
    } finally {
      await queryRunner.release();
    }
  }
}