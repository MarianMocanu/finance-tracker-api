import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';

@Controller('entry')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Post()
  create(@Body() createEntryDto: CreateEntryDto) {
    return this.entryService.create(createEntryDto);
  }

  @Get()
  findAll() {
    return this.entryService.findAll();
  }

  @Get('category/:id')
  findByCategory(@Param('id') id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException('Category id is not a number');
    }
    return this.entryService.findByCategory(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.validateEntryId(id);
    return this.entryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntryDto: UpdateEntryDto) {
    this.validateEntryId(id);
    return this.entryService.update(+id, updateEntryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.validateEntryId(id);
    return this.entryService.remove(+id);
  }

  validateEntryId(id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException('Entry id is not a number');
    }
  }
}
