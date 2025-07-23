import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async create(userCreate: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userCreate.password, 10);
    const email = userCreate.email;
    const name = userCreate.name || null;
    return await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async validateUser(userCreate: CreateUserDto): Promise<CreateUserDto | null> {
    const user = await this.findByEmail(userCreate.email);
    const passwordUser = userCreate.password;
    if (user && (await bcrypt.compare(passwordUser, user.password))) {
      const { ...result } = user;
      return {
        id: result.id,
        email: result.email,
        name: result.name ?? undefined,
      } as CreateUserDto;
    }
    return null;
  }
}
