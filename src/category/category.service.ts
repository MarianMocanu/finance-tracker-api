import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const foundCategory = await this.categoryRepository.findOneBy({ id });
    if (!foundCategory) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryRepository.findOneBy({ id });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const foundCategory = await this.categoryRepository.findOneBy({ id });
    if (!foundCategory) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const foundCategory = await this.categoryRepository.findOneBy({ id });
    if (!foundCategory) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryRepository.delete(id);
  }
}
