import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // Atualizar último login
    await this.usersService.updateLastLogin(user.id);

    // Obter dados atualizados do usuário
    const updatedUser = await this.usersService.findById(user.id);
    const { password, ...userData } = updatedUser;

    const payload = { 
      sub: user.id,
      email: user.email,
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: userData,
    };
  }

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    
    const { password, ...result } = user;
    return result;
  }
}
