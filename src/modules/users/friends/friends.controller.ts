import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../users.service';

@Controller('/users/:userId/friends')
export class FriendsController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUserFriends(@Param('userId') userId: string) {
    return this.usersService.findAllUserFriends(userId);
  }
}
