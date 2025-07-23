import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { createUserSchema, loginSchema } from './dto/zod.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      throw new UnauthorizedException(validation.error.message);
    }
    const existingUser = await this.usersService.findByEmail(body.email);
    if (existingUser) {
      throw new UnauthorizedException('Usuario já cadastrado!');
    }
    const user = await this.usersService.create(body);
    return user;
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      throw new UnauthorizedException(validation.error.message);
    }
    const user = await this.usersService.validateUser(body);
    if (!user) {
      throw new UnauthorizedException('Dados inválidos!');
    }
    const token = await this.authService.generateToken(
      user.id ?? user.id,
      user.email,
    );
    return { access_token: token };
  }
}
