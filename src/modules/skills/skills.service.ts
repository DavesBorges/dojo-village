import { Injectable } from '@nestjs/common';
import { NotFoundException } from '../../exceptions/NotFount';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsRepository } from './skills-repository';

@Injectable()
export class SkillsService {
  constructor(private skillsRepository: SkillsRepository) {}

  async create(createSkillDto: CreateSkillDto) {
    const skillId = await this.skillsRepository.createSkill(createSkillDto);
    return this.findOne(skillId);
  }

  findAll() {
    return this.skillsRepository.getAllSkills();
  }

  async findOne(id: string) {
    const skill = await this.skillsRepository.getSkillById(id);
    if (!skill) {
      throw new NotFoundException();
    }

    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    await this.findOne(id);
    await this.skillsRepository.updateSkill(id, updateSkillDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const skill = await this.findOne(id);
    await this.skillsRepository.removeSkill(id);
    return skill;
  }
}
