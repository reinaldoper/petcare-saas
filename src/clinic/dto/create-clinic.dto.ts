import { ApiProperty } from '@nestjs/swagger';

export class CreateClinicDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  razaoSocial: string;
}

export class NameDto {
  @ApiProperty()
  name: string;
}
