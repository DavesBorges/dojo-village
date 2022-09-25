import { IsNumber, IsString } from 'class-validator';

export class CreateCharacterDto {
  @IsNumber()
  agility: number;

  @IsNumber()
  dexterity: number;

  @IsString()
  family: string;

  @IsNumber()
  gender: number;

  @IsNumber()
  hp: number;

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
