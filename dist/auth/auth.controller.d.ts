import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            nome: string;
            role: string;
            isActive: boolean;
            lastLoginAt: Date;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    register(userData: any): Promise<{
        id: number;
        email: string;
        nome: string;
        role: string;
        isActive: boolean;
        lastLoginAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(req: any): any;
}
