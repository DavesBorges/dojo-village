import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FamiliesService } from './families.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('families')
@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  createFamily(@Body() createFamilyDto: CreateFamilyDto) {
    return this.familiesService.create(createFamilyDto);
  }

  @Get()
  getAllFamilies() {
    return this.familiesService.findAll();
  }

  @Get(':id')
  getFamily(@Param('id') id: string) {
    return this.familiesService.findOne(id);
  }

  @Patch(':id')
  updateFamily(
    @Param('id') id: string,
    @Body() updateFamilyDto: UpdateFamilyDto,
  ) {
    return this.familiesService.update(id, updateFamilyDto);
  }

  @Delete(':id')
  removeFamily(@Param('id') id: string) {
    return this.familiesService.remove(id);
  }
}
