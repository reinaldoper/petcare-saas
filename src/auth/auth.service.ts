import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(
    userId: number | undefined,
    email: string,
    role: string,
  ): Promise<string> {
    return this.jwtService.signAsync({ sub: userId, email, role });
  }
}
