import { INestApplication } from '@nestjs/common';
import { Kysely } from 'kysely';
import { TestRequst } from '../../../test/request';
import { initModuleForE2ETest } from '../../../test/test-setup';
import { AppModule } from '../../app.module';
import { DB } from '../../data/schema-definition';
import { validateOrRejectAssureLayout } from '../../utils/class-validator-helpers';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillResponse } from './responses/skill.response';

describe('Skills endpoint', () => {
  let app: INestApplication;
  let request: TestRequst;

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

  const skills = [
    {
      id: '1',
      description: 'Jab',
      family: '1',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
    {
      id: '2',
      description: 'Straight Right',
      family: '1',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
  ];
  beforeEach(async () => {
    app = await initModuleForE2ETest([AppModule]);
    const database = app.get<Kysely<DB>>(Kysely);

    await database.deleteFrom('skill').execute();
    await database.deleteFrom('family').execute();

    await database.insertInto('family').values(families).execute();
    await database.insertInto('skill').values(skills).execute();

    request = new TestRequst(app);
  });

  describe('GET /skills Read all skills', () => {
    test('Should read all skills', async () => {
      // Given
      const path = `/skills`;

      // When
      const getResponse = await request.get(path);

      // Then
      expect(getResponse.status).toBe(200);
      await validateOrRejectAssureLayout(SkillResponse, getResponse.body[0]);

      const idsRetrieved = getResponse.body.map((skill) => skill.id);

      expect(idsRetrieved).toContain(skills[0].id);
      expect(idsRetrieved).toContain(skills[1].id);
    });
  });

  describe('GET /skills/<skillId> Read one skill', () => {
    test('Should read one skill if it exist', async () => {
      // Given
      const skillId = '1';
      const path = `/skills/${skillId}`;

      // When
      const getResponse = await request.get(path);

      // then
      await validateOrRejectAssureLayout(SkillResponse, getResponse.body);
      expect(getResponse.body.id).toBe(skillId);
    });

    test('Should return 404 if the skill does not exist', async () => {
      // Given
      const skillId = 'NOT EXIST';
      const path = `/skills/${skillId}`;

      // When
      const getResponse = await request.get(path);

      // Then
      expect(getResponse.status).toBe(404);
    });
  });

  describe('POST /skills create one skill', () => {
    test('Should create a skill', async () => {
      // Given
      const path = `/skills`;
      const createSkillPayload: CreateSkillDto = {
        baseDamage: 10,
        casting: 2,
        coolDown: 3,
        cost: 1,
        description: 'Test',
        family: '1',
        purpose: 'ATTACK',
      };

      // When
      const postResponse = await request.post(path, createSkillPayload);

      // Then
      const expectedResponseBody = {
        ...createSkillPayload,
        id: postResponse.body.id,
        family: families[0],
      };

      expect(postResponse.body).toStrictEqual(expectedResponseBody);
      await validateOrRejectAssureLayout(SkillResponse, postResponse.body);
    });
  });

  describe('PATCH /skills/<id> update a skill', () => {
    test('Should update a skill', async () => {
      // Given
      const updateSkillPayload = { description: 'Kick' };
      const path = `/skills/1`;

      // When
      const beforePatchGetResponse = await request.get(path);
      const patchResponse = await request.patch(path, updateSkillPayload);
      const afterPatchGetResponse = await request.get(path);

      // Then
      expect(patchResponse.body).toStrictEqual({
        ...beforePatchGetResponse.body,
        ...updateSkillPayload,
      });
      expect(patchResponse.body).toStrictEqual(afterPatchGetResponse.body);
    });

    test('Should return 404 if the skill does not exist', async () => {
      // Given
      const skillId = 'NOT EXIST';
      const path = `/skills/${skillId}`;

      // When
      const patchResponse = await request.patch(path, {});

      // Then
      expect(patchResponse.status).toBe(404);
    });
  });

  describe('DELETE /skills/<id> delete a skill', () => {
    test('Should delete a skill', async () => {
      // Given
      const path = `/skills/1`;

      // When
      const beforeDeleteGetResponse = await request.get(path);
      const deleteResponse = await request.delete(path);
      const afterDeleteResponse = await request.get(path);

      // Then
      expect(deleteResponse.body).toStrictEqual(beforeDeleteGetResponse.body);
      expect(afterDeleteResponse.status).toBe(404);
    });

    test('Should return 404 if the skill does not exist', async () => {
      // Given
      const skillId = 'NOT EXIST';
      const path = `/skills/${skillId}`;

      // When
      const deeleteResponse = await request.delete(path);

      // Then
      expect(deeleteResponse.status).toBe(404);
    });
  });
});
