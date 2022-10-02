import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFriendRequest {
  @ApiProperty()
  @IsString()
  id: string;
}
