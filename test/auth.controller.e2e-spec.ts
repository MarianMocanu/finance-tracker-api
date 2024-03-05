import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  const createUserDto = new CreateUserDto('John', 'mail@john.com', 'qwerty');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = moduleFixture.get<UserService>(UserService);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/auth/signup (POST)', () => {
    it('should return 400 status code if invalid data', async () => {
      const invalidUser = { ...createUserDto, password: 200 };

      const response = await request(app.getHttpServer()).post('/auth/signup').send(invalidUser);

      expect(response.statusCode).toBe(400);
    });

    it('should return 201 and the new user after creation', async () => {
      const response = await request(app.getHttpServer()).post('/auth/signup').send(createUserDto);

      expect(response.statusCode).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.name).toBe(createUserDto.name);
      expect(response.body.id).toBeDefined();

      await userService.remove(response.body.id);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should return 401 status code if invalid data', async () => {
      const newUser = await userService.create(createUserDto);
      const invalidLoginDto = new LoginDto('mail@john.com', 'invalidPassword');

      const response = await request(app.getHttpServer()).post('/auth/login').send(invalidLoginDto);

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');

      await userService.remove(newUser.id);
    });

    it('should return 200 status code,a token and a user after login', async () => {
      const newUser = await userService.create(createUserDto);
      const loginDto = new LoginDto(createUserDto.email, createUserDto.password);

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginDto);

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.token.split('.').length).toBe(3);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.name).toBe(createUserDto.name);

      await userService.remove(newUser.id);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
