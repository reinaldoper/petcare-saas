import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaClient, $Enums } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserRoleDto } from './dto/role.dto';

const Role = $Enums.Role;

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async create(userCreate: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userCreate.password, 10);
    const email = userCreate.email;
    const name = userCreate.name;
    const clinicId = userCreate.clinicId;
    const existAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN', clinicId },
    });

    const { ADMIN, CLIENT } = Role;

    const role = existAdmin ? CLIENT : ADMIN;

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { plan: true },
    });

    if (!clinic) {
      throw new ForbiddenException('Clínica não encontrada.');
    }
    if (clinic.plan?.type === 'FREE') {
      const userCount = await prisma.user.count({
        where: { clinicId },
      });

      if (userCount >= 5) {
        throw new ForbiddenException(
          'Limite de 5 usuários no plano FREE atingido.',
        );
      }
    }
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
        name: result.name,
        role: result.role,
      } as unknown as CreateUserDto;
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
    } as unknown as CreateUserDto;
  }

  async deleteUser(userId: number) {
    return await prisma.user.delete({ where: { id: userId } });
  }

  async getUserByClinicId(clinicId: number) {
    const users = await prisma.user.findMany({
      where: { clinicId },
      orderBy: { createdAt: 'asc' },
      include: { clinic: true, pets: true },
    });

    const filtered = users.filter((user) => user.role === 'CLIENT');
    return filtered;
  }
}
