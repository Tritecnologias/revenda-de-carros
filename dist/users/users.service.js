"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAll(page = 1, limit = 10) {
        const [users, total] = await this.usersRepository.findAndCount({
            select: ['id', 'email', 'nome', 'role', 'isActive', 'lastLoginAt', 'createdAt'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            users,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: ['id', 'email', 'nome', 'role', 'isActive', 'lastLoginAt', 'createdAt']
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async create(userData) {
        const existingUser = await this.findByEmail(userData.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.usersRepository.create({
            ...userData,
            password: hashedPassword,
        });
        const savedUser = await this.usersRepository.save(user);
        delete savedUser.password;
        return savedUser;
    }
    async update(id, updateData) {
        const user = await this.findById(id);
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await this.findByEmail(updateData.email);
            if (existingUser) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        await this.usersRepository.update(id, updateData);
        return this.findById(id);
    }
    async remove(id) {
        const user = await this.findById(id);
        await this.usersRepository.remove(user);
    }
    async updateLastLogin(id) {
        await this.usersRepository.update(id, {
            lastLoginAt: new Date(),
        });
    }
    async updateProfile(id, updateUserDto) {
        const user = await this.findById(id);
        if (updateUserDto.nome) {
            user.nome = updateUserDto.nome;
        }
        return this.usersRepository.save(user);
    }
    async updateRole(id, role) {
        const user = await this.findById(id);
        const validRoles = ['admin', 'cadastrador', 'user'];
        if (!validRoles.includes(role)) {
            throw new common_1.HttpException('Invalid role', common_1.HttpStatus.BAD_REQUEST);
        }
        user.role = role;
        return this.usersRepository.save(user);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.HttpException('Invalid current password', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.usersRepository.save(user);
        return { message: 'Password updated successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map