import { DataSource } from 'typeorm';
import { CreateOwnerSeed } from './seeds/create-owner.seed';
import { AppDataSource } from './data.source';

AppDataSource.initialize()
  .then(async (dataSource: DataSource) => {
    console.log('🚀 Database connected. Running seed...');
    const seeder = new CreateOwnerSeed();
    await seeder.run(dataSource);
    console.log('🌱 Seeding completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
