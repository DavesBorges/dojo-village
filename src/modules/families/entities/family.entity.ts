import { IsString } from 'class-validator';
import { Family as FamilySchema } from '../../../data/schema-definition';
export class Family implements FamilySchema {
  @IsString()
  description: string;

  @IsString()
  id: string;
}
