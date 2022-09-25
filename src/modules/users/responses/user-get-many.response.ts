import { IsString } from 'class-validator';
import { User } from '../../../data/schema-definition';
import { IsNullable } from '../../../utils/class-validator.decorators';

export class UserGetManyResponse implements User {
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
