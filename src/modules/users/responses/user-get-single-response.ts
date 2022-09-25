import { IsString } from 'class-validator';
import { IsNullable } from '../../../utils/class-validator.decorators';

export class UserGetSingleResponse {
  @IsNullable()
  @IsString()
  character: string | null;

  @IsNullable()
  @IsString()
  currentArena: string | null;

  @IsString()
  id: string;

  @IsString()
  name: string;
}
