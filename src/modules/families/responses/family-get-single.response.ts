import { IsString } from 'class-validator';

export class FamilyGetSingleResponse {
  @IsString()
  id: string;

  @IsString()
  description: string;
}
