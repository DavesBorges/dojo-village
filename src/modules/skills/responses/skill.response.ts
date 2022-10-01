import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import {
  IsNestedObject,
  IsNullable,
} from '../../../utils/class-validator.decorators';
import { CharacterNestedFamily } from '../../characters/responses/character-get-many.response';

export class SkillResponse {
  @ApiProperty()
  @IsNumber()
  baseDamage: number;

  @ApiProperty()
  @IsNumber()
  casting: number;

  @ApiProperty()
  @IsNumber()
  coolDown: number;

  @ApiProperty()
  @IsNumber()
  cost: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNullable()
  @IsNestedObject(CharacterNestedFamily)
  family: CharacterNestedFamily | null;

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  purpose: string;
}
