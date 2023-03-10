import { INestApplication } from '@nestjs/common';
import { Kysely } from 'kysely';
import { TestRequst } from '../../../../test/request';
import { initModuleForE2ETest } from '../../../../test/test-setup';
import { DB } from '../../../data/schema-definition';
import { validateOrRejectAssureLayout } from '../../../utils/class-validator-helpers';
import { DatabaseModule } from '../../database/database.module';
import { FriendResponse } from '../responses/friend.response';
import { UserGetManyResponse } from '../responses/user-get-many.response';
import { UserGetSingleResponse } from '../responses/user-get-single-response';
import { UsersModule } from '../users.module';

describe('users module', () => {
  let request: TestRequst;
  let app: INestApplication;

  const users = [
    { id: '1', name: 'John', character: null, currentArena: null },
    { id: '2', name: 'Paul', character: null, currentArena: null },
    { id: '3', name: 'Anne', character: null, currentArena: null },
    { id: '4', name: 'Marr', character: null, currentArena: null },
  ];

  const friendShips = [
    {
      id: '1',
      sender: '1',
      receiver: '2',
      status: 1,
    },
  ];

  beforeEach(async () => {
    app = await initModuleForE2ETest([UsersModule, DatabaseModule]);
    request = new TestRequst(app);

    const database = app.get<Kysely<DB>>(Kysely);
    await database.deleteFrom('user').execute();
    await database.deleteFrom('friendship').execute();

    await Promise.all(
      users.map((user) => database.insertInto('user').values(user).execute()),
    );

    await database.insertInto('friendship').values(friendShips).execute();
  });

  describe('GET /users read many users', () => {
    test('Should return the existent users', async () => {
      // Given
      const path = '/users';

      // when
      const response = await request.get(path);

      // Then
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(users);
      await validateOrRejectAssureLayout(UserGetManyResponse, response.body[0]);
    });
  });

  describe('GET /users/<id> read single user', () => {
    test('Should return the right user in the right schema', async () => {
      // Given
      const userId = users[0].id;
      const path = `/users/${userId}`;

      // When
      const response = await request.get(path);

      // Then
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(users[0]);
      await validateOrRejectAssureLayout(UserGetSingleResponse, response.body);
    });

    test('Should return 404 NOT found if the user does not exist', async () => {
      // Given
      const userId = '12341421';
      const path = `/users/${userId}`;

      // When
      const response = await request.get(path);

      // Then
      expect(response.status).toBe(404);
    });
  });
  describe('POST /users create user', () => {
    test('Should create a new user successfully', async () => {
      // Given
      const user = {
        name: 'Lucke Rockold',
      };

      const path = `/users`;

      // When
      const response = await request.post(path, user);

      // Then
      expect(response.status).toBe(201);

      expect(response.body).toStrictEqual({
        id: response.body.id,
        ...user,
        currentArena: null,
        character: null,
      });

      await validateOrRejectAssureLayout(UserGetSingleResponse, response.body);

      // When
      const getUserResponse = await request.get(`/users/${response.body.id}`);

      // Then
      expect(getUserResponse.body).toStrictEqual(response.body);
    });

    test('Should return 400 if the payload does not match spec', async () => {
      // Given
      const createUserPayload = { nickName: 'Mike' };
      const path = `/users`;

      // When
      const response = await request.post(path, createUserPayload);

      // Then
      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /users/<id> update user', () => {
    test('Should successfully update a user', async () => {
      // Given
      const updateUserPayload = { name: 'JohnBolt' };
      const path = `/users/${users[0].id}`;

      // When
      const response = await request.patch(path, updateUserPayload);

      // then
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        ...users[0],
        ...updateUserPayload,
      });
    });

    test('Should return 404 if the reqeust payload is not valid', async () => {
      // Given
      const updateUserPayload = {
        id: users[0].id,
        nickName: 'John Travolta',
      };
      const path = `/users/${users[0].id}`;

      // When
      const response = await request.patch(path, updateUserPayload);

      // Then
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /users/<userId>', () => {
    test('Should successfully delete an user', async () => {
      // Given
      const userId = users[0].id;
      const path = `/users/${userId}`;

      const { body: user } = await request.get(path);

      // When
      const response = await request.delete(path);

      // Then
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(user);

      // When
      const afterDeleteGetResponse = await request.get(path);

      //Then
      expect(afterDeleteGetResponse.status).toBe(404);
    });
  });

  describe('/users/<id>/friends', () => {
    describe('GET /users/<id>/friends Get user friends ', () => {
      test('Should read all user friends', async () => {
        // Given
        let path = `/users/1/friends`;

        // When
        let response = await request.get(path);

        // Then
        expect(response.body[0].id).toBe(users[1].id);
        await validateOrRejectAssureLayout(FriendResponse, response.body[0]);

        // Given
        path = `/users/2/friends`;

        // When
        response = await request.get(path);

        // then
        expect(response.body[0].id).toBe(users[0].id);
        await validateOrRejectAssureLayout(FriendResponse, response.body[0]);
      });
    });

    describe('GET /users/<id>/friends/<id> read a user friend', () => {
      test('Should read a user friend by id', async () => {
        // Given
        const path = `/users/1/friends/2`;

        // When
        const response = await request.get(path);

        // Then
        expect(response.body.id).toBe(users[1].id);
        await validateOrRejectAssureLayout(FriendResponse, response.body);
      });

      test('Should return 404 if the user friend does not exist', async () => {
        // Given
        const path = `/users/1/friends/3`;

        // When
        const response = await request.get(path);

        // Then
        expect(response.status).toBe(404);
      });
    });

    describe('POST /users/<id>/friends create a friend request', () => {
      test('Should create a friend request', async () => {
        // Given
        const path = `/users/1/friends`;
        const createFriendRequest = { id: '3' };

        // When
        const postResponse = await request.post(path, createFriendRequest);
        const getResponse = await request.get(`${path}/3`);

        // Then
        expect(postResponse.body).toStrictEqual(getResponse.body);
        expect(getResponse.body.status).toBe('PENDING');
      });
    });

    describe('PATCH /users/<userId>/friends/<friendId>', () => {
      test('Should accept a friend request', async () => {
        // Given
        const path = `/users/1/friends`;
        const createFrendRequest = { id: '3' };

        // When
        await request.post(path, createFrendRequest);
        const patchResponse = await request.patch(`/users/3/friends/1`, {
          status: 'ACCEPTED',
        });
        const afterPatchGetResponse = await request.get(`/users/3/friends/1`);

        // then
        expect(patchResponse.body).toStrictEqual(afterPatchGetResponse.body);
        expect(afterPatchGetResponse.body.status).toBe('ACCEPTED');
      });
    });
  });
});
