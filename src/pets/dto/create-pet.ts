import { ApiProperty } from '@nestjs/swagger';

export class CreatePetDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  ownerName: string;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  species: 'CAT' | 'DOG';

  @ApiProperty()
  userId: number;

  @ApiProperty()
  clinicId: number;
}
