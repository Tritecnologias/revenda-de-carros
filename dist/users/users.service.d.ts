import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findByEmail(email: string): Promise<User | undefined>;
    findById(id: number): Promise<User | undefined>;
    create(userData: CreateUserDto): Promise<User>;
    update(id: number, updateData: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<void>;
    updateLastLogin(id: number): Promise<void>;
    updateProfile(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    updateRole(id: number, role: string): Promise<User>;
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
