import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CreateEntryDto } from 'src/entry/dto/create-entry.dto';
import { EntryService } from 'src/entry/entry.service';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { User } from 'src/user/entities/user.entity';

describe('Entry Controller (e2e)', () => {
  let app: INestApplication;
  let entryService: EntryService;
  let categoryService: CategoryService;
  let userService: UserService;
  let authService: AuthService;
  let token: string;
  let user: User;

  const entryDTO: CreateEntryDto = new CreateEntryDto(
    100,
    new Date().toISOString(),
    'USD',
    'Salary',
    'First salary of the year',
  );
  const categoryDTO = new CreateCategoryDto('Salary');
  let newCategory: Category;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    entryService = moduleFixture.get<EntryService>(EntryService);
    categoryService = moduleFixture.get<CategoryService>(CategoryService);
    userService = moduleFixture.get<UserService>(UserService);
    authService = moduleFixture.get<AuthService>(AuthService);

    const userDTO = new CreateUserDto('marian', 'mail@marian.com', 'qwerty');
    user = await userService.create(userDTO);

    const loginDTO = new LoginDto('mail@marian.com', 'qwerty');
    const loginResponse = await authService.login(loginDTO);
    token = loginResponse.token;

    newCategory = await categoryService.create(categoryDTO);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/entry (GET)', () => {
    it('should return 200 and an array of entries', async () => {
      const response = await request(app.getHttpServer()).get('/entry').set('Authorization', token);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/entry/category/:id (GET)', () => {
    it('should return 400 status code if category id is not a number', async () => {
      const response = await request(app.getHttpServer())
        .get('/entry/category/a123')
        .set('Authorization', token);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Category id is not a number');
    });

    it('should return 404 if categoryId not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/entry/category/999999')
        .set('Authorization', token);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Category not found');
    });

    it('should return 200 and an array of entries', async () => {
      //arrange
      const newEntry = await entryService.create({ ...entryDTO, categoryId: newCategory.id });
      //act
      const response = await request(app.getHttpServer())
        .get(`/entry/category/${newCategory.id}`)
        .set('Authorization', token);
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
      const response = await request(app.getHttpServer())
        .post('/entry')
        .set('Authorization', token)
        .send(invalidEntry);
      expect(response.statusCode).toBe(400);
    });

    it('should return 201 and the new entry after creation', async () => {
      const response = await request(app.getHttpServer())
        .post('/entry')
        .set('Authorization', token)
        .send({ ...entryDTO, categoryId: newCategory.id });

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
      const response = await request(app.getHttpServer())
        .get('/entry/a123')
        .set('Authorization', token);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Entry id is not a number');
    });

    it('should return 404 status code if entry id not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/entry/999999999')
        .set('Authorization', token);
      expect(response.statusCode).toBe(404);
    });

    it('should return 200 and the queried element', async () => {
      const newEntry = await entryService.create(entryDTO);
      const response = await request(app.getHttpServer())
        .get(`/entry/${newEntry.id}`)
        .set('Authorization', token);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(newEntry.id);
      expect(response.body.amount).toBe(newEntry.amount);
      expect(response.body.categoryId).toBe(newEntry.categoryId);
      // delete the entry at the end of the test
      await entryService.remove(newEntry.id);
    });
  });

  describe('/entry/:id (PATCH)', () => {
    it('should return 400 status code if entry id is not a number', async () => {
      const response = await request(app.getHttpServer())
        .patch('/entry/a9999999999')
        .set('Authorization', token);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Entry id is not a number');
    });

    it('should return 404 if entry not found', async () => {
      const response = await request(app.getHttpServer())
        .patch('/entry/999999')
        .set('Authorization', token);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Entry not found');
    });

    it('should return 400 status code if invalid data', async () => {
      const newEntry = await entryService.create(entryDTO);
      const invalidEntry = { ...newEntry, amount: 'a' };

      const response = await request(app.getHttpServer())
        .patch(`/entry/${invalidEntry.id}`)
        .set('Authorization', token)
        .send(invalidEntry);
      expect(response.statusCode).toBe(400);

      // delete the entry at the end of the test
      await entryService.remove(newEntry.id);
    });

    it('should return 200 and the updated data', async () => {
      const newEntry = await entryService.create(entryDTO);
      const updatedEntry = { ...newEntry, amount: 200, categoryId: newCategory.id };
      const response = await request(app.getHttpServer())
        .patch(`/entry/${updatedEntry.id}`)
        .set('Authorization', token)
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
      const response = await request(app.getHttpServer())
        .delete('/entry/a123')
        .set('Authorization', token);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Entry id is not a number');
    });

    it('should return 404 if entry not found', async () => {
      const response = await request(app.getHttpServer())
        .delete('/entry/999999')
        .set('Authorization', token);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Entry not found');
    });

    it('should return 204', async () => {
      const newEntry = await entryService.create({ ...entryDTO, categoryId: newCategory.id });
      const response = await request(app.getHttpServer())
        .delete(`/entry/${newEntry.id}`)
        .set('Authorization', token);
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  afterAll(async () => {
    await categoryService.remove(newCategory.id);
    await userService.remove(user.id);
    await app.close();
  });
});
