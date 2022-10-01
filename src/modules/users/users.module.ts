import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { FriendsController } from './friends/friends.controller';

@Module({
  controllers: [UsersController, FriendsController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
