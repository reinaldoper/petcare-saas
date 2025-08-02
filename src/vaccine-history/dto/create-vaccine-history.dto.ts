import { ApiProperty } from '@nestjs/swagger';

export class CreateVaccineHistoryDto {
  @ApiProperty()
  vaccine: string;

  @ApiProperty()
  appliedAt: string;

  @ApiProperty()
  petId: number;

  @ApiProperty()
  clinicId: number;
}

export class CreateClinicIdDto {
  @ApiProperty()
  clinicId: number;

  @ApiProperty()
  petId: number;
}
