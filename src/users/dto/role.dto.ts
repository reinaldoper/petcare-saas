import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserRoleDto {
  @ApiProperty()
  role: 'ADMIN' | 'CLIENT';
}
