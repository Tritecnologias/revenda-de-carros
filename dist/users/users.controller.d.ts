import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: number, limit?: number): Promise<{
        users: import("./entities/user.entity").User[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<{
        id: number;
        email: string;
        nome: string;
        role: string;
        isActive: boolean;
        lastLoginAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(req: any, changePasswordDto: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
