import { ApiProperty } from '@nestjs/swagger';

class WebhookData {
  @ApiProperty({ example: '1234567890' })
  id: string;
}

export class WebhookDto {
  @ApiProperty({ type: WebhookData })
  data: WebhookData;
}
