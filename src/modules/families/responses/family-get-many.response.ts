import { IsString } from 'class-validator';

export class FamilyGetManyResponse {
  @IsString()
  id: string;

  @IsString()
  description: string;
}
