import { ApiProperty } from '@nestjs/swagger';

export class CreateStockDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  validUntil: string;
}
