import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export const createInitialUser = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  // Check if admin user already exists
  const existingUser = await userRepository.findOne({
    where: { email: 'admin@example.com' }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = userRepository.create({
      email: 'admin@example.com',
      nome: 'Administrador',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      lastLoginAt: null,
    });

    await userRepository.save(adminUser);
    console.log('Initial user created successfully');
  } else {
    console.log('Admin user already exists');
  }
};
