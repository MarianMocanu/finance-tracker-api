import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateEntryDto } from 'src/entry/dto/create-entry.dto';

describe('Entry Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/entry (POST)', () => {
    it('should create a new entry', async () => {
      const validEntry = new CreateEntryDto(
        100,
        new Date(),
        'USD',
        'Salary',
        'First salary of the year',
      );
      const { body } = await request(app.getHttpServer())
        .post('/entry')
        .send(validEntry)
        .expect(201);

      expect(body.amount).toBe(validEntry.amount);
      expect(body.id).toBeDefined();
    });
  });
});
