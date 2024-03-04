import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Entry } from './entities/entry.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(Entry) private entryRepository: Repository<Entry>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
  ) {}

  async create(createEntryDto: CreateEntryDto): Promise<Entry> {
    return this.entryRepository.save(createEntryDto);
  }

  findAll() {
    return this.entryRepository.find();
  }

  async findByCategory(id: number) {
    const foundCategory = await this.categoryRepository.findOneBy({ id });
    if (!foundCategory) {
      throw new NotFoundException('Category not found');
    }
    return this.entryRepository.find({ where: { categoryId: id } });
  }

  async findOne(id: number) {
    const foundEntry = await this.entryRepository.findOneBy({ id });
    if (!foundEntry) {
      throw new NotFoundException('Entry not found');
    }
    return foundEntry;
  }

  async update(id: number, updateEntryDto: UpdateEntryDto) {
    const foundEntry = await this.entryRepository.findOneBy({ id });
    if (!foundEntry) {
      throw new NotFoundException('Entry not found');
    }
    return this.entryRepository.update(id, updateEntryDto);
  }

  async remove(id: number) {
    const foundEntry = await this.entryRepository.findOneBy({ id });
    if (!foundEntry) {
      throw new NotFoundException('Entry not found');
    }
    return this.entryRepository.delete(id);
  }
}
