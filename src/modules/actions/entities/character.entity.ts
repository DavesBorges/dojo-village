import { Skill } from "./skill.entity";

export class Character {
  ownerId: string;
  name: string;
  skills: Skill[];
  hp: number;
}
