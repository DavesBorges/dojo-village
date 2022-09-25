import { Injectable } from '@nestjs/common';
import { NotFoundException } from '../../exceptions/NotFount';
import { CharactersRepository } from './characters-repository';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Injectable()
export class CharactersService {
  protected charactersRepository: CharactersRepository;

  constructor(charactersRepository: CharactersRepository) {
    this.charactersRepository = charactersRepository;
  }

  async create(createCharacterDto: CreateCharacterDto) {
    const idOfCreatedCharacter =
      await this.charactersRepository.createCharacter(createCharacterDto);
    return this.charactersRepository.getCharacterById(idOfCreatedCharacter);
  }

  findAll() {
    return this.charactersRepository.getAllCharacters();
  }

  async findOne(id: string) {
    const characterFound = await this.charactersRepository.getCharacterById(id);

    if (!characterFound) {
      throw new NotFoundException();
    }

    return characterFound;
  }

  async update(id: string, updateCharacterDto: UpdateCharacterDto) {
    await this.findOne(id);

    await this.charactersRepository.updateCharacter(id, updateCharacterDto);

    await this.charactersRepository.getCharacterById(id);
    return this.findOne(id);
  }

  async remove(id: string) {
    const character = await this.findOne(id);

    await this.charactersRepository.deleteCharacter(id);

    await this.charactersRepository.getCharacterById(id);
    return character;
  }
}
