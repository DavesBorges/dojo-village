import { Injectable } from '@nestjs/common';
import { Action } from './entities/action.entity';
import { Character } from './entities/character.entity';

@Injectable()
export class ActionsService {
  characters: Character[] = [
    {
      ownerId: '1',
      hp: 100,
      name: 'Bruce Lee',
      skills: [
        {
          id: '1',
          description: 'Jab 👊',
          baseDamage: 4,
          coolDown: 1,
        },
        {
          id: '2',
          description: 'UpperCut ✊',
          baseDamage: 8,
          coolDown: 1,
        },
      ],
    },
    {
      ownerId: '2',
      hp: 100,
      name: 'Jean Claude Van-damme',
      skills: [
        {
          id: '1',
          description: 'Knee 🦵',
          baseDamage: 6,
          coolDown: 1,
        },
        {
          id: '2',
          description: 'Elbow 💪',
          baseDamage: 7,
          coolDown: 1,
        },
      ],
    },
  ];

  clientToCharacter: Record<string, Character> = {};
  identify(ownerId: string, clientId: string) {
    console.log({ ownerId });
    this.clientToCharacter[clientId] = this.characters.find(
      (character) => character.ownerId === ownerId,
    );
    return this.clientToCharacter[clientId];
  }

  getCharacters() {
    return this.characters;
  }
  async processAction(action: Action, clientId: string) {
    const character = this.clientToCharacter[clientId];
    console.log({ character });
    const opponent = this.characters.find(
      (element) => element.ownerId !== character.ownerId,
    );

    const skill = character.skills.find((skill) => skill.id === action.skillId);
    opponent.hp -= skill.baseDamage;

    return this.characters;
  }
}
