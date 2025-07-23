import { ApiProperty } from '@nestjs/swagger';

export class CreateVaccineHistoryDto {
  @ApiProperty()
  vaccine: string;

  @ApiProperty()
  appliedAt: string;

  @ApiProperty()
  petId: number;
}
