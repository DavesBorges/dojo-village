import { INestApplication } from '@nestjs/common';
import { Kysely } from 'kysely';
import { TestRequst } from '../../../../test/request';
import { initModuleForE2ETest } from '../../../../test/test-setup';
import { DB } from '../../../data/schema-definition';
import { validateOrRejectAssureLayout } from '../../../utils/class-validator-helpers';
import { DatabaseModule } from '../../database/database.module';
import { CharactersModule } from '../characters.module';
import { CreateCharacterDto } from '../dto/create-character.dto';
import { CharacterGetManyResponse } from '../responses/character-get-many.response';
import { CharacterGetSingleResponse } from '../responses/character-get-single.response';

describe('characters controller', () => {
  let request: TestRequst;
  let app: INestApplication;

  const characters = [
    {
      agility: 25,
      dexterity: 25,
      family: '1',
      gender: 25,
      hp: 100,
      id: '1',
      nickName: 'travolta',
      strength: 32,
      synergy: 12,
      vigor: 14,
      xp: 20,
    },
    {
      agility: 25,
      dexterity: 25,
      family: '2',
      gender: 25,
      hp: 100,
      id: '2',
      nickName: 'dr. dock',
      strength: 32,
      synergy: 12,
      vigor: 14,
      xp: 20,
    },
  ];

  const families = [
    {
      description: 'Kung Fu',
      id: '1',
    },
    {
      description: 'Jiu Jitsu',
      id: '2',
    },
  ];

  const findFamily = (id: string) =>
    families.find((family) => family.id === id);

  beforeAll(async () => {
    app = await initModuleForE2ETest([CharactersModule, DatabaseModule]);
    request = new TestRequst(app);

    const database = app.get<Kysely<DB>>(Kysely);

    await database.deleteFrom('family').execute();
    await database.deleteFrom('character').execute();

    await Promise.all(
      families.map((family) =>
        database.insertInto('family').values(family).execute(),
      ),
    );

    await Promise.all(
      characters.map((character) =>
        database.insertInto('character').values(character).execute(),
      ),
    );
  });

  describe('GET /characters read all characters', () => {
    test('Should read all characters', async () => {
      // Given
      const path = `/characters`;

      // When
      const response = await request.get(path);

      // Then
      const expectedResponse = characters.map((character) => ({
        ...character,
        family: findFamily(character.family),
      }));
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(expectedResponse);

      await validateOrRejectAssureLayout(
        CharacterGetManyResponse,
        response.body[0],
      );
    });
  });

  describe('GET /characters/<id> read one character', () => {
    test('Should read the right character', async () => {
      // Given
      const path = `/characters/${characters[0].id}`;

      // When
      const response = await request.get(path);

      // Then
      expect(response.status).toBe(200);
      expect(response.body.id).toStrictEqual(characters[0].id);
      await validateOrRejectAssureLayout(
        CharacterGetSingleResponse,
        response.body,
      );
    });

    test('Should return 404 if the character does not exist', async () => {
      // Given
      const path = `/characters/087`;

      // When
      const response = await request.get(path);

      // Then
      expect(response.status).toBe(404);
    });
  });

  describe('POST /characters Create character', () => {
    test('Should successfully create a character', async () => {
      // Given
      const path = `/characters`;
      const createCharacterPayload: CreateCharacterDto = {
        agility: 80,
        dexterity: 25,
        family: '1',
        gender: 25,
        hp: 100,
        nickName: 'Bruce Willies',
        strength: 32,
        synergy: 12,
        vigor: 14,
        xp: 20,
      };

      // When
      const response = await request.post(path, createCharacterPayload);
      const afterPostGetResponse = await request.get(
        `${path}/${response.body.id}`,
      );

      // Then
      expect(response.status).toBe(201);

      const expectedResponse = {
        ...createCharacterPayload,
        id: response.body.id,
        family: findFamily(createCharacterPayload.family),
      };

      expect(response.body).toStrictEqual(expectedResponse);
      expect(response.body).toStrictEqual(afterPostGetResponse.body);
    });
  });

  describe('PATCH /characters/<characterId> Update a character', () => {
    test('Should successfully update a character', async () => {
      // Given
      const path = `/characters/${characters[0].id}`;
      const characterUpdate = {
        nickName: 'John Travolta',
      };

      // When
      const response = await request.patch(path, characterUpdate);

      // Then
      expect(response.status).toBe(200);

      const expectedResponse = {
        ...characters[0],
        ...characterUpdate,
        family: findFamily(characters[0].id),
      };
      expect(response.body).toStrictEqual(expectedResponse);
      await validateOrRejectAssureLayout(
        CharacterGetSingleResponse,
        response.body,
      );
    });

    test('Should return 404 if the character does not exist', async () => {
      // Given
      const path = `/characters/087`;

      // When
      const response = await request.patch(path, {});

      // Then
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /characters/<characterId>', () => {
    test('Should successfully delete a character', async () => {
      // Given
      const path = `/characters/${characters[1].id}`;

      // When
      const response = await request.delete(path);
      const afterDeleteGetResponse = await request.get(path);

      // Then
      expect(response.status).toBe(200);
      const expectedResponse = {
        ...characters[1],

        family: findFamily(characters[1].family),
      };
      expect(response.body).toStrictEqual(expectedResponse);
      expect(afterDeleteGetResponse.status).toBe(404);
    });

    test('Should return 404 if the character does not exist', async () => {
      // Given
      const path = `/characters/087`;

      // When
      const response = await request.delete(path);

      // Then
      expect(response.status).toBe(404);
    });
  });
});
