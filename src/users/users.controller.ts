import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Patch,
  Param,
  UseGuards,
  Delete,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { createUserSchema, loginSchema } from './dto/zod.dto';
import { UpdateUserRoleDto } from './dto/role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('auth')
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
      user.role || 'CLIENT',
      user.clinicId,
    );
    return { access_token: token };
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateUserRole(
    @Param('id') id: string,
    @Body() role: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(+id, role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteUser(
    @Param('id') id: string,
    @Body() body: { clinicId: number },
  ) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new UnauthorizedException('ID inválido!');
    }

    return this.usersService.deleteUser(userId, body.clinicId);
  }

  @Get(':clinicId/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getUsersByClinic(@Param('clinicId') clinicId: string) {
    const clinicIdNumber = parseInt(clinicId, 10);
    if (isNaN(clinicIdNumber)) {
      throw new UnauthorizedException('ID da clínica inválido!');
    }
    return this.usersService.getUserByClinicId(clinicIdNumber);
  }
}
