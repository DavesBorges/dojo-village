import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCharacterDto {
  @ApiProperty()
  @IsNumber()
  agility: number;

  @ApiProperty()
  @IsNumber()
  dexterity: number;

  @ApiProperty()
  @IsString()
  family: string;

  @ApiProperty()
  @IsNumber()
  gender: number;

  @ApiProperty()
  @IsNumber()
  hp: number;

  @ApiProperty()
  @IsString()
  nickName: string;

  @ApiProperty()
  @IsNumber()
  strength: number;

  @ApiProperty()
  @IsNumber()
  synergy: number;

  @ApiProperty()
  @IsNumber()
  vigor: number;

  @ApiProperty()
  @IsNumber()
  xp: number;
}
