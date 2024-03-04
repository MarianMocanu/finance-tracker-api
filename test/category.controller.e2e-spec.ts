import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { CategoryService } from 'src/category/category.service';

describe('category Controller (e2e)', () => {
  let app: INestApplication;
  let categoryService: CategoryService;
  const categoryDTO = new CreateCategoryDto('Subscriptions');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    categoryService = moduleFixture.get<CategoryService>(CategoryService);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/category (GET)', () => {
    it('should return 200 and an array of categories', async () => {
      const response = await request(app.getHttpServer()).get('/category');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/category (POST)', () => {
    it('should return 400 status code if invalid data', async () => {
      const invalidCategory = { ...categoryDTO, name: 1234 };

      const response = await request(app.getHttpServer()).post('/category').send(invalidCategory);

      expect(response.statusCode).toBe(400);
    });

    it('should return 201 and the new category after creation', async () => {
      const response = await request(app.getHttpServer()).post('/category').send(categoryDTO);

      expect(response.statusCode).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.name).toBe(categoryDTO.name);
      expect(response.body.id).toBeDefined();

      await categoryService.remove(response.body.id);
    });
  });

  describe('/category/:id (GET)', () => {
    it('should return 400 status code if category id is not a number', async () => {
      const response = await request(app.getHttpServer()).get('/category/a123');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Category id is not a number');
    });

    it('should return 404 status code if category id not found', async () => {
      const response = await request(app.getHttpServer()).get('/category/999999999');

      expect(response.statusCode).toBe(404);
    });

    it('should return 200 and the queried element', async () => {
      const newCateogry = await categoryService.create(categoryDTO);

      const response = await request(app.getHttpServer()).get(`/category/${newCateogry.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(newCateogry.id);
      expect(response.body.name).toBe(newCateogry.name);

      await categoryService.remove(newCateogry.id);
    });
  });

  describe('/category/:id (PATCH)', () => {
    it('should return 400 status code if category id is not a number', async () => {
      const response = await request(app.getHttpServer()).patch('/category/a9999999999');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Category id is not a number');
    });

    it('should return 404 if category not found', async () => {
      const response = await request(app.getHttpServer()).patch('/category/999999');

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Category not found');
    });

    it('should return 400 status code if invalid data', async () => {
      const newCateogry = await categoryService.create(categoryDTO);
      const invalidcategory = { ...newCateogry, name: 1234 };

      const response = await request(app.getHttpServer())
        .patch(`/category/${invalidcategory.id}`)
        .send(invalidcategory);
      expect(response.statusCode).toBe(400);

      await categoryService.remove(newCateogry.id);
    });

    it('should return 200 and the updated data', async () => {
      const newCateogry = await categoryService.create(categoryDTO);
      const updatedcategory = { ...newCateogry, name: 'Updated name' };

      const response = await request(app.getHttpServer())
        .patch(`/category/${updatedcategory.id}`)
        .send(updatedcategory);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.affected).toBe(1);

      await categoryService.remove(newCateogry.id);
    });
  });

  describe('/category/:id (DELETE)', () => {
    it('should return 400 status code if category id is not a number', async () => {
      const response = await request(app.getHttpServer()).delete('/category/a123');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Category id is not a number');
    });

    it('should return 404 if category not found', async () => {
      const response = await request(app.getHttpServer()).delete('/category/999999');

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Category not found');
    });

    it('should return 204', async () => {
      const newCateogry = await categoryService.create(categoryDTO);

      const response = await request(app.getHttpServer()).delete(`/category/${newCateogry.id}`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
