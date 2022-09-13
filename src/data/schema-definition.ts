export interface Arena {
  awayPlayer: string;
  homePlayer: string;
  id: string;
  status: number;
}

export interface Character {
  agility: number;
  dexterity: number;
  family: string;
  gender: number;
  hp: number;
  id: string;
  nickName: string;
  strength: number;
  synergy: number;
  vigor: number;
  xp: number;
}

export interface Family {
  description: string;
  id: string;
}

export interface MartialArt {
  code: string;
  description: string;
  id: number;
}

export interface User {
  character: string | null;
  currentArena: string | null;
  id: string;
  name: string;
}

export interface DB {
  arena: Arena;
  character: Character;
  family: Family;
  martial_art: MartialArt;
  user: User;
}
