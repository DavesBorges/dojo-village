import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateFriendRequest } from './dto/create-friend.dto';
import { UpdateFriend } from './dto/upate-friend.dto';

@Controller('/users/:userId/friends')
export class FriendsController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUserFriends(@Param('userId') userId: string) {
    return this.usersService.findAllUserFriends(userId);
  }

  @Get(':friendId')
  getUserFriendById(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.usersService.findUserFriendById(userId, friendId);
  }

  @Post()
  createFriendRequest(
    @Param('userId') userId: string,
    @Body() createFriendRequest: CreateFriendRequest,
  ) {
    return this.usersService.createFriendRequest(
      userId,
      createFriendRequest.id,
    );
  }

  @Patch(':friendId')
  updateFriendShip(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
    @Body() updateFriend: UpdateFriend,
  ) {
    return this.usersService.updateFriendShip(
      userId,
      friendId,
      updateFriend.status,
    );
  }
}
