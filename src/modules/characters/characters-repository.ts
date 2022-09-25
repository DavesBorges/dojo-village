import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Character, DB } from '../../data/schema-definition';
import '../../utils/kysely.extensions';
import { generateUUID } from '../../utils/uuid';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { CharacterGetManyResponse } from './responses/character-get-many.response';
import { CharacterGetSingleResponse } from './responses/character-get-single.response';

@Injectable()
export class CharactersRepository {
  protected database: Kysely<DB>;

  constructor(database: Kysely<DB>) {
    this.database = database;
  }

  async createCharacter(
    createCharacterDto: CreateCharacterDto,
  ): Promise<string> {
    const id = generateUUID();
    await this.database
      .insertInto('character')
      .values({ ...createCharacterDto, id })
      .execute();

    return id;
  }

  async getCharacterById(id: string): Promise<CharacterGetSingleResponse> {
    const character = await this.database
      .selectFrom('character')
      .selectAll('character')
      .where('id', '=', id)
      .executeTakeFirst();

    return this.constructCharacterWithFamily(character);
  }

  async getAllCharacters(): Promise<CharacterGetManyResponse[]> {
    const characters = await this.database
      .selectFrom('character')
      .selectAll('character')
      .execute();

    const charactersWithFamily = await Promise.all(
      characters.map((character) =>
        this.constructCharacterWithFamily(character),
      ),
    );

    return charactersWithFamily;
  }

  async updateCharacter(
    id: string,
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<void> {
    await this.database
      .updateTable('character')
      .set(updateCharacterDto)
      .where('id', '=', id)
      .execute();
  }

  async deleteCharacter(id: string) {
    await this.database
      .deleteFrom('character')
      .where('character.id', '=', id)
      .execute();
  }

  private async constructCharacterWithFamily(character: Character) {
    if (!character) {
      return undefined;
    }

    const characterFamily = await this.database
      .selectFrom('family')
      .select(['family.id', 'family.description'])
      .where('family.id', '=', character.family)
      .executeTakeFirst();

    return {
      ...character,
      family: characterFamily,
    };
  }
}
