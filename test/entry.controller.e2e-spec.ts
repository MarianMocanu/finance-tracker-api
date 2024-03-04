import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CreateEntryDto } from 'src/entry/dto/create-entry.dto';
import { EntryService } from 'src/entry/entry.service';

describe('Entry Controller (e2e)', () => {
  let app: INestApplication;
  let entryService: EntryService;
  const entryDTO: CreateEntryDto = new CreateEntryDto(
    100,
    new Date(),
    'USD',
    'Salary',
    'First salary of the year',
    1,
  );

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    entryService = moduleFixture.get<EntryService>(EntryService);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/entry (GET)', () => {
    it('should return 200 and an array of entries', async () => {
      const response = await request(app.getHttpServer()).get('/entry');

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/entry/category/:id (GET)', () => {
    it('should return 400 status code if category id is not a number', async () => {
      const response = await request(app.getHttpServer()).get('/entry/category/a123');
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Category id is not a number');
    });

    it('should return 404 if categoryId not found', async () => {
      const response = await request(app.getHttpServer()).get('/entry/category/999999');
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Category not found');
    });

    it('should return 200 and an array of entries', async () => {
      //arrange
      const newEntry = await entryService.create(entryDTO);
      //act
      const response = await request(app.getHttpServer()).get('/entry/category/1');
      //assert
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      // delete the entry at the end of the test
      await entryService.remove(newEntry.id);
    });
  });

  describe('/entry (POST)', () => {
    it('should return 400 status code if invalid data', async () => {
      const invalidEntry = { ...entryDTO, amount: 'a' };
      const response = await request(app.getHttpServer()).post('/entry').send(invalidEntry);
      expect(response.statusCode).toBe(400);
    });

    it('should return 201 and the new entry after creation', async () => {
      const response = await request(app.getHttpServer()).post('/entry').send(entryDTO);
      expect(response.statusCode).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.amount).toBe(entryDTO.amount);
      expect(response.body.id).toBeDefined();

      // delete the entry at the end of the test
      await entryService.remove(response.body.id);
    });
  });

  describe('/entry/:id (GET)', () => {
    it('should return 400 status code if entry id is not a number', async () => {
      const response = await request(app.getHttpServer()).get('/entry/a123');
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Entry id is not a number');
    });

    it('should return 404 status code if entry id not found', async () => {
      const response = await request(app.getHttpServer()).get('/entry/999999999');
      expect(response.statusCode).toBe(404);
    });

    it('should return 200 and the queried element', async () => {
      const newEntry = await entryService.create(entryDTO);
      const response = await request(app.getHttpServer()).get(`/entry/${newEntry.id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(newEntry.id);
      expect(response.body.amount).toBe(newEntry.amount);
      // delete the entry at the end of the test
      await entryService.remove(newEntry.id);
    });
  });

  describe('/entry/:id (PATCH)', () => {
    it('should return 400 status code if entry id is not a number', async () => {
      const response = await request(app.getHttpServer()).patch('/entry/a9999999999');
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Entry id is not a number');
    });

    it('should return 404 if entry not found', async () => {
      const response = await request(app.getHttpServer()).patch('/entry/999999');
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Entry not found');
    });

    it('should return 400 status code if invalid data', async () => {
      const newEntry = await entryService.create(entryDTO);
      const invalidEntry = { ...newEntry, amount: 'a' };

      const response = await request(app.getHttpServer())
        .patch(`/entry/${invalidEntry.id}`)
        .send(invalidEntry);
      expect(response.statusCode).toBe(400);

      // delete the entry at the end of the test
      await entryService.remove(newEntry.id);
    });

    it('should return 200 and the updated data', async () => {
      const newEntry = await entryService.create(entryDTO);
      const updatedEntry = { ...newEntry, amount: 200 };
      const response = await request(app.getHttpServer())
        .patch(`/entry/${updatedEntry.id}`)
        .send(updatedEntry);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.affected).toBe(1);

      // delete the entry at the end of the test
      await entryService.remove(newEntry.id);
    });
  });

  describe('/entry/:id (DELETE)', () => {
    it('should return 400 status code if entry id is not a number', async () => {
      const response = await request(app.getHttpServer()).delete('/entry/a123');
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Entry id is not a number');
    });

    it('should return 404 if entry not found', async () => {
      const response = await request(app.getHttpServer()).delete('/entry/999999');
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Entry not found');
    });

    it('should return 204', async () => {
      const newEntry = await entryService.create(entryDTO);
      const response = await request(app.getHttpServer()).delete(`/entry/${newEntry.id}`);
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
