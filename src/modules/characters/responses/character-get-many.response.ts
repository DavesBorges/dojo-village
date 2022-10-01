import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { IsNestedObject } from '../../../utils/class-validator.decorators';

export class CharacterNestedFamily {
  @IsString()
  id: string;

  @IsString()
  description: string;
}

export class CharacterGetManyResponse {
  @ApiProperty()
  @IsNumber()
  agility: number;

  @IsNumber()
  dexterity: number;

  @IsNestedObject(CharacterNestedFamily)
  family: CharacterNestedFamily;

  @IsNumber()
  gender: number;

  @IsNumber()
  hp: number;

  @IsString()
  id: string;

  @IsString()
  nickName: string;

  @IsNumber()
  strength: number;

  @IsNumber()
  synergy: number;

  @IsNumber()
  vigor: number;

  @IsNumber()
  xp: number;
}
