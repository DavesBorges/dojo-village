import { Injectable } from '@nestjs/common';
import { NotFoundException } from '../../exceptions/NotFount';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';
import { FamiliesRepository } from './families.repository';
import { FamilyGetManyResponse } from './responses/family-get-many.response';
import { FamilyGetSingleResponse } from './responses/family-get-single.response';

@Injectable()
export class FamiliesService {
  private familiesRepository: FamiliesRepository;

  constructor(familiesRepository: FamiliesRepository) {
    this.familiesRepository = familiesRepository;
  }

  /**
   * Creates a family and return the family created
   * @param createFamilyDto the family object to be created
   * @returns the created family
   */
  async create(createFamilyDto: CreateFamilyDto): Promise<Family> {
    const familyCreatedId = await this.familiesRepository.createFamily(
      createFamilyDto,
    );
    return this.familiesRepository.getFamilyById(familyCreatedId);
  }

  /**
   * Retrieve all families
   */
  findAll(): Promise<FamilyGetManyResponse[]> {
    return this.familiesRepository.getAllFamilies();
  }

  /**
   *  Retrieves a family based on id
   * @param id  the id of the family to retrieve
   * @returns the family found
   */
  async findOne(id: string): Promise<FamilyGetSingleResponse> {
    const family = await this.familiesRepository.getFamilyById(id);
    if (!family) {
      throw new NotFoundException();
    }

    return family;
  }

  /**
   * Updates a family
   * @param id  the id of the family to update
   * @param updateFamilyDto the fields of the family to update
   * @returns the updated family
   */
  async update(id: string, updateFamilyDto: UpdateFamilyDto) {
    const updatePayload = { id, ...updateFamilyDto };

    await this.findOne(id);

    await this.familiesRepository.modifyFamily(updatePayload);
    return this.familiesRepository.getFamilyById(id);
  }

  /**
   * Deletes a family
   * @param id  the id of the family to be deleted
   * @returns the deleted family
   */
  async remove(id: string) {
    const family = await this.findOne(id);

    await this.familiesRepository.removeFamily(id);
    return family;
  }
}
