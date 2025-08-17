import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  clinicId: number;
}
