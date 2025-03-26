"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialUser = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const bcrypt = require("bcrypt");
const createInitialUser = async (dataSource) => {
    const userRepository = dataSource.getRepository(user_entity_1.User);
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
    }
    else {
        console.log('Admin user already exists');
    }
};
exports.createInitialUser = createInitialUser;
//# sourceMappingURL=initial-user.seed.js.map