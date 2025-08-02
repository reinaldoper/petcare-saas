import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  petId: number;

  @ApiProperty()
  clinicId: number;
}
