import { Injectable } from '@nestjs/common';
import { PrismaClient, $Enums } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserRoleDto } from './dto/role.dto';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async create(userCreate: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userCreate.password, 10);
    const email = userCreate.email;
    const role = userCreate.role as $Enums.Role | undefined;
    const name = userCreate.name || null;
    const clinicId = userCreate.clinicId;
    return await prisma.user.create({
      data: { email, password: hashedPassword, name, role, clinicId },
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async validateUser(login: LoginDto): Promise<CreateUserDto | null> {
    const user = await this.findByEmail(login.email);
    const passwordUser = login.password;
    if (user && (await bcrypt.compare(passwordUser, user.password))) {
      const { ...result } = user;
      return {
        id: result.id,
        email: result.email,
        name: result.name ?? undefined,
        role: result.role,
      } as CreateUserDto;
    }
    return null;
  }

  async updateRole(
    userId: number,
    newRole: UpdateUserRoleDto,
  ): Promise<CreateUserDto | null> {
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      return null;
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole.role },
    });
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name ?? undefined,
      role: updatedUser.role,
    } as CreateUserDto;
  }

  async deleteUser(userId: number) {
    return await prisma.user.delete({ where: { id: userId } });
  }
}
