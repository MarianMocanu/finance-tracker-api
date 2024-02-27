import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Entry } from './entities/entry.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntryService {
  constructor(@InjectRepository(Entry) private entryRepository: Repository<Entry>) {}

  async create(createEntryDto: CreateEntryDto): Promise<Entry> {
    return this.entryRepository.save(createEntryDto);
  }

  findAll() {
    return this.entryRepository.find();
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
