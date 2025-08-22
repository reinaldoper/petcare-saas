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

  @ApiProperty({ required: false })
  priority?: boolean;

  @ApiProperty({ required: false })
  price?: number;
}

export class DeleteAppointmentDto {
  @ApiProperty()
  clinicId: number;
}
