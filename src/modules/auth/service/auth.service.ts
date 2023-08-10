import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { Role } from '../../../utils/enum/role.enum';
import { JwtToken } from '../../../utils/enum/auth.enum';
import { User } from '../../../modules/user/entity/user.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);
    if (user && (await this.comparePassword(password, user.password))) {
      return user;
    } else {
      throw new UnauthorizedException(
        'Login error: The email or password you have entered is incorrect. Please verify your information and try again',
      );
    }
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    if (!user.enabled) {
      throw new UnauthorizedException('Your account is disabled');
    }
    this.setLastActive(username);
    const [token, refreshToken] = await this.generateTokens(username, user.role, user.id);
    return {
      user: {
        id: user.id,
        username,
        role: user.role,
      },
      token,
      refreshToken,
    };
  }

  private generateTokens(username: string, role: Role, sub: string) {
    const tokenPayload = { username, sub, role, type: JwtToken.SESSION_TOKEN };
    const refreshTokenPayload = { username, sub, role, type: JwtToken.REFRESH_TOKEN };
    const tokenPromise = this.jwtService.signAsync(tokenPayload, {
      expiresIn: this.configService.get<string>('TOKEN_EXPIRES_IN'),
    });
    const refreshTokenPromise = this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: this.configService.get<string>('REFRESH_EXPIRES_IN'),
    });

    return Promise.all([tokenPromise, refreshTokenPromise]);
  }

  private async setLastActive(username: string) {
    const user = await this.userService.findByUsername(username);
    user!.lastActiveAt = new Date();
    return this.userService.update(user!.id!, user!);
  }
}
