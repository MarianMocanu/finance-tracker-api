import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';

describe('User Controller (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let authService: AuthService;
  let user: User;
  let token: string;
  let adminToken: string;
  let adminUser: User;
  const userDTO = new CreateUserDto('John', 'mail@john.com', 'qwerty');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = moduleFixture.get<UserService>(UserService);
    authService = moduleFixture.get<AuthService>(AuthService);

    const userDTO = new CreateUserDto('marian', 'mail@marian.com', 'qwerty');
    user = await userService.create(userDTO);

    const loginDTO = new LoginDto('mail@marian.com', 'qwerty');
    const loginResponse = await authService.login(loginDTO);
    token = loginResponse.token;

    const adminLoginDto = new LoginDto('admin@admin.com', 'admin');
    const adminLoginResponse = await authService.login(adminLoginDto);
    adminToken = adminLoginResponse.token;
    adminUser = adminLoginResponse.user;

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/user (POST)', () => {
    it('should return 400 status code if invalid data', async () => {
      const invalidUser = { ...userDTO, email: 222 };

      const response = await request(app.getHttpServer()).post('/user').send(invalidUser);

      expect(response.statusCode).toBe(400);
    });

    it('should return 201 and the new user after creation', async () => {
      const response = await request(app.getHttpServer()).post('/user').send(userDTO);

      expect(response.statusCode).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.name).toBe(userDTO.name);
      expect(response.body.id).toBeDefined();

      // delete the entry at the end of the test
      await userService.remove(response.body.id);
    });
  });

  describe('/user/:id (GET)', () => {
    it('should return 400 status code if user id is not a number', async () => {
      const response = await request(app.getHttpServer()).get('/user/a123');
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('User id is not a number');
    });

    it('should return 404 status code if user id not found', async () => {
      const response = await request(app.getHttpServer()).get('/user/999999999');
      expect(response.statusCode).toBe(404);
    });

    it('should return 200 and the queried element', async () => {
      const newUser = await userService.create(userDTO);

      const response = await request(app.getHttpServer()).get(`/user/${newUser.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(newUser.id);
      expect(response.body.name).toBe(newUser.name);

      await userService.remove(newUser.id);
    });
  });

  describe('/user/:id (PATCH)', () => {
    it('should return 400 status code if user id is not a number', async () => {
      const response = await request(app.getHttpServer())
        .patch('/user/a9999999999')
        .set('Authorization', token);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('User id is not a number');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app.getHttpServer())
        .patch('/user/999999')
        .set('Authorization', token);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 400 status code if invalid data', async () => {
      const newUser = await userService.create(userDTO);
      const invalidUser = { ...newUser, name: 1234 };

      const response = await request(app.getHttpServer())
        .patch(`/user/${invalidUser.id}`)
        .set('Authorization', token)
        .send(invalidUser);

      expect(response.statusCode).toBe(400);

      await userService.remove(newUser.id);
    });

    it('should return 200 and the updated data', async () => {
      const newUser = await userService.create(userDTO);
      const updatedUser = { ...newUser, name: 'updated name' };

      const response = await request(app.getHttpServer())
        .patch(`/user/${updatedUser.id}`)
        .set('Authorization', token)
        .send(updatedUser);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.affected).toBe(1);

      await userService.remove(newUser.id);
    });
  });

  describe('/user/:id (DELETE)', () => {
    it('should return 403 status code if user is not an admin', async () => {
      const response = await request(app.getHttpServer())
        .delete('/user/a123')
        .set('Authorization', token);
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe('You must be an ADMIN to perform this action');
    });

    it('should return 400 status code if user id is not a number', async () => {
      const response = await request(app.getHttpServer())
        .delete('/user/a123')
        .set('Authorization', adminToken);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('User id is not a number');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app.getHttpServer())
        .delete('/user/999999')
        .set('Authorization', adminToken);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 204', async () => {
      const newUser = await userService.create(userDTO);

      const response = await request(app.getHttpServer())
        .delete(`/user/${newUser.id}`)
        .set('Authorization', adminToken);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
  });

  afterAll(async () => {
    await userService.remove(user.id);
    await app.close();
  });
});
