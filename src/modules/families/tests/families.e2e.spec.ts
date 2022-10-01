import { INestApplication } from '@nestjs/common';
import { Kysely } from 'kysely';
import { TestRequst } from '../../../../test/request';
import { initModuleForE2ETest } from '../../../../test/test-setup';
import { DB, Family } from '../../../data/schema-definition';
import { validateOrRejectAssureLayout } from '../../../utils/class-validator-helpers';
import { DatabaseModule } from '../../database/database.module';
import { CreateFamilyDto } from '../dto/create-family.dto';
import { UpdateFamilyDto } from '../dto/update-family.dto';
import { FamiliesModule } from '../families.module';
import { FamilyGetManyResponse } from '../responses/family-get-many.response';
import { FamilyGetSingleResponse } from '../responses/family-get-single.response';

describe('families module', () => {
  let request: TestRequst;
  let app: INestApplication;

  const families: Family[] = [
    {
      description: 'Kung Fu',
      id: '1',
    },
    {
      description: 'Jiu Jitsu',
      id: '2',
    },
  ];

  beforeEach(async () => {
    app = await initModuleForE2ETest([FamiliesModule, DatabaseModule]);
    request = new TestRequst(app);

    const database = app.get<Kysely<DB>>(Kysely);

    await database.deleteFrom('family').execute();
    await Promise.all(
      families.map((family) =>
        database.insertInto('family').values(family).execute(),
      ),
    );
  });

  describe('GET /families Read all families', () => {
    test('Should read all families', async () => {
      // Given
      const path = `/families`;

      // When
      const response = await request.get(path);

      // Then
      expect(response.body).toStrictEqual(families);
      await validateOrRejectAssureLayout(
        FamilyGetManyResponse,
        response.body[0],
      );
      expect(response.status).toBe(200);
    });
  });

  describe('GET /families/<id Read family by id', () => {
    test('Should return the family if the id exists', async () => {
      // Given
      const familyId = families[0].id;
      const path = `/families/${familyId}`;

      // When
      const response = await request.get(path);

      // then
      expect(response.body).toStrictEqual(families[0]);
      await validateOrRejectAssureLayout(
        FamilyGetSingleResponse,
        response.body,
      );

      expect(response.status).toBe(200);
    });
    test('Should return 404 not found if the family does not exists', async () => {
      // Given
      const familyId = 'DONT EXIST';
      const path = `/families/${familyId}`;

      // When
      const response = await request.get(path);

      // Then
      expect(response.status).toBe(404);
    });
  });

  describe('POST /families Create family', () => {
    test('Should create family', async () => {
      // Given
      const createFamilyPayload: CreateFamilyDto = {
        description: 'Boxing',
      };

      const path = '/families';

      // When
      const response = await request.post(path, createFamilyPayload);
      const afterPostGetResponse = await request.get(
        '/families/' + response.body.id,
      );

      // Then
      const expectedResponseBody = {
        ...createFamilyPayload,
        id: response.body.id,
      };
      expect(response.body).toStrictEqual(expectedResponseBody);
      expect(response.body).toStrictEqual(afterPostGetResponse.body);
      await validateOrRejectAssureLayout(
        FamilyGetSingleResponse,
        response.body,
      );

      expect(response.status).toBe(201);
    });
  });
  describe('PATCH /families update family', () => {
    test('Should sucessfully update a family', async () => {
      // Given
      const updateFamilyPayload: UpdateFamilyDto = {
        description: 'Kung Fu Shaolin',
      };
      const familyId = '1';

      const path = `/families/${familyId}`;

      // When
      const patchResponse = await request.patch(path, updateFamilyPayload);
      const getResponse = await request.get(path);

      // Then
      expect(patchResponse.body).toStrictEqual(getResponse.body);
      expect(patchResponse.status).toBe(200);
    });

    test('Should throw 404 if the family does not exist', async () => {
      // Given
      const updateFamilyPayload: UpdateFamilyDto = {
        description: 'Kung Fu Shaolin',
      };
      const familyId = 'DONTEXIST';

      const path = `/families/${familyId}`;

      // When
      const patchResponse = await request.patch(path, updateFamilyPayload);

      // Then
      expect(patchResponse.status).toBe(404);
    });
  });

  describe('DELETE /families/<id> Delete a family', () => {
    test('Should successfully delete a family', async () => {
      // Given
      const familyId = families[0].id;
      const path = `/families/${familyId}`;

      const beforeDeleteGetResponse = await request.get(path);

      // when
      const deleteResposne = await request.delete(path);

      // Then
      expect(deleteResposne.body).toStrictEqual(beforeDeleteGetResponse.body);

      const afterDeleteGetResponse = await request.get(path);
      expect(afterDeleteGetResponse.status).toBe(404);
    });

    test('Should return 404 if the family does not exist', async () => {
      // Given
      const familyId = 'DONTExist';
      const path = `/families/${familyId}`;

      // When
      const deleteResponse = await request.delete(path);

      // then
      expect(deleteResponse.status).toBe(404);
    });
  });
});
