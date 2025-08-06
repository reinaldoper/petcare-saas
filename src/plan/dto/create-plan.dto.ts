import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty()
  type: 'FREE' | 'PAY';

  @ApiProperty()
  clinicId: number;
}
