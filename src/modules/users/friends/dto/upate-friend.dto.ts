import { IsIn } from 'class-validator';

export class UpdateFriend {
  @IsIn(['ACCEPTED'])
  status: 'ACCEPTED';
}
