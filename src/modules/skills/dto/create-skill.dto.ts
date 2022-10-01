import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { IsNullable } from '../../../utils/class-validator.decorators';

export class CreateSkillDto {
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
  @IsString()
  family: string | null;

  @ApiProperty()
  @IsString()
  purpose: string;
}
