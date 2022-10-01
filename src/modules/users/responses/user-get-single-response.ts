import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsNullable } from '../../../utils/class-validator.decorators';

export class UserGetSingleResponse {
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
}
