export interface Arena {
  awayPlayer: string | null;
  homePlayer: string | null;
  id: string;
}

export interface Character {
  agility: number;
  dexterity: number;
  family: string | null;
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

export interface Friendship {
  id: string;
  receiver: string | null;
  sender: string | null;
  status: number;
}

export interface Skill {
  baseDamage: number;
  casting: number;
  coolDown: number;
  cost: number;
  description: string;
  family: string | null;
  id: string;
  purpose: string;
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
  friendship: Friendship;
  skill: Skill;
  user: User;
}
