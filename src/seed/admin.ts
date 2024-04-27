import { Role } from '../user/entities/user.entity';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

const adminSeed = { name: 'admin', email: 'admin@admin.com', password: 'admin', role: Role.ADMIN };

async function seed() {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity{.ts,.js}'],
  });

  const connection = await AppDataSource.initialize();
  if (connection.isInitialized) {
    console.log('Seeding admin user');
    const userRepository = connection.getRepository('User');

    const user = await userRepository.findOneBy({ email: adminSeed.email });
    if (!user) {
      const adminUser = userRepository.create(adminSeed);
      const savedAdminUser = await userRepository.save(adminUser);
      console.log('Admin user seeded', savedAdminUser);
    } else {
      console.log('Admin user ALREADY seeded');
    }
  }
  await connection.destroy();
}

seed();
