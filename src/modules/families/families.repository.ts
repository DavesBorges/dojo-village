import { Injectable } from '@nestjs/common';
import { Insertable, Kysely, Updateable } from 'kysely';
import { DB, Family } from '../../data/schema-definition';
import { generateUUID } from '../../utils/uuid';

/**
 * Class responsable for interfacting with the database
 */
@Injectable()
export class FamiliesRepository {
  private database: Kysely<DB>;
  constructor(database: Kysely<DB>) {
    this.database = database;
  }

  /**
   * Persists a new family
   * @param family the family to be created
   * @returns the id of the newly created family
   */
  async createFamily(family: Insertable<Family>): Promise<string> {
    const newId = generateUUID();
    const familyToInsert = { ...family, id: newId };

    await this.database.insertInto('family').values(familyToInsert).execute();
    return newId;
  }

  /**
   * Read all families
   * @returns a promise of family arary
   */
  getAllFamilies() {
    return this.database.selectFrom('family').selectAll().execute();
  }

  /**
   * Reads an specific family by id
   * @param id the id of the family to retrieve
   * @returns the family which id matches the **id** arguments
   */
  getFamilyById(id: string) {
    return this.database
      .selectFrom('family')
      .selectAll('family')
      .where('id', '=', id)
      .execute();
  }

  /**
   * Modifies an existing family
   * @param family an object with the fields to update. **NOTE** the id property is
   * mandatory in order to find the entry to update
   */
  async modifyFamily(family: Updateable<Family>) {
    const familyToModify = { ...family };
    const familyId = familyToModify.id;
    delete familyToModify.id;

    await this.database
      .updateTable('family')
      .set(familyToModify)
      .where('family.id', '=', familyId)
      .execute();
  }

  /**
   * Deletes a family
   * @param familyId the id of the family to remove
   */
  async removeFamily(familyId: string) {
    await this.database
      .deleteFrom('family')
      .where('id', '=', familyId)
      .execute();
  }
}
