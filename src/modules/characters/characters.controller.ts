import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { CharacterGetSingleResponse } from './responses/character-get-single.response';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @ApiCreatedResponse({ type: CharacterGetSingleResponse })
  @Post()
  createCharacter(@Body() createCharacterDto: CreateCharacterDto) {
    return this.charactersService.create(createCharacterDto);
  }

  @Get()
  getAllCharacters() {
    return this.charactersService.findAll();
  }

  @Get(':id')
  getCharacter(@Param('id') id: string) {
    return this.charactersService.findOne(id);
  }

  @Patch(':id')
  updateCharacter(
    @Param('id') id: string,
    @Body()
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<CharacterGetSingleResponse> {
    return this.charactersService.update(id, updateCharacterDto);
  }

  @Delete(':id')
  removeCharacter(@Param('id') id: string) {
    return this.charactersService.remove(id);
  }
}
