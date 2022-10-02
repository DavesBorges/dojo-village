import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { IsNullable } from '../../../utils/class-validator.decorators';

export class FriendResponse {
  @ApiProperty()
  @IsNullable()
  @IsString()
  character: string | null;

  @ApiProperty()
  @IsNullable()
  @IsString()
  currentArena: string | null;

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @IsIn(['ACCEPTED', 'PENDING'])
  status: 'ACCEPTED' | 'PENDING';
}
