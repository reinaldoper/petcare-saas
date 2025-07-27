import { ApiProperty } from '@nestjs/swagger';

export class CreateStockDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  type: 'PRODUCT' | 'VACCINE';

  @ApiProperty()
  validUntil: string;

  @ApiProperty()
  clinicId: number;
}
