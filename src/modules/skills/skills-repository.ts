import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Kysely } from 'kysely';
import { DB, Skill } from '../../data/schema-definition';
import '../../utils/kysely.extensions';
import { generateUUID } from '../../utils/uuid';
import { SkillResponse } from './responses/skill.response';

@Injectable()
export class SkillsRepository {
  private databaase: Kysely<DB>;
  constructor(db: Kysely<DB>) {
    this.databaase = db;
  }

  public async getAllSkills() {
    const queryBuilder = this.constructSkillQueryBuilder();
    const skills = await queryBuilder.execute();
    return plainToInstance(SkillResponse, skills);
  }

  public async getSkillById(id: string) {
    const queryBuilder = this.constructSkillQueryBuilder();
    const skill = await queryBuilder
      .where('skill.id', '=', id)
      .executeTakeFirst();

    return plainToInstance(SkillResponse, skill);
  }

  public async createSkill(skill: Omit<Skill, 'id'>) {
    const id = generateUUID();
    const skillToInsert = { ...skill, id };
    this.databaase.insertInto('skill').values(skillToInsert).execute();
    return id;
  }

  public async updateSkill(id: string, update: Partial<Skill>) {
    await this.databaase
      .updateTable('skill')
      .set(update)
      .where('id', '=', id)
      .execute();
  }

  public async removeSkill(id: string) {
    await this.databaase
      .deleteFrom('skill')
      .where('skill.id', '=', id)
      .execute();
  }
  private constructSkillQueryBuilder() {
    return this.databaase
      .selectFrom('skill')
      .selectAll('skill')
      .defaultLeftJoinToJson('family', 'skill', ['id', 'description']);
  }
}
