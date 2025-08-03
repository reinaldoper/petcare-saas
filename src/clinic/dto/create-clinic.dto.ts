import { ApiProperty } from '@nestjs/swagger';

export class CreateClinicDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;
}

export class NameDto {
  @ApiProperty()
  name: string;
}
