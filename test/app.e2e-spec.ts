import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { SequelizeExceptionFilter } from '../src/common/filters/sequelize-exception.filter';

describe('Library API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const { AppModule } = require('../src/app.module');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new SequelizeExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);
    expect(response.body.status).toBe('ok');
  });

  it('doit exécuter un flux complet de gestion', async () => {
    const category = await request(app.getHttpServer())
      .post('/categories')
      .send({
        name: 'Roman',
        description: 'Romans contemporains et classiques',
      })
      .expect(201);

    const author = await request(app.getHttpServer())
      .post('/authors')
      .send({
        firstName: 'Albert',
        lastName: 'Camus',
        bio: 'Auteur et philosophe français',
      })
      .expect(201);

    const user = await request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'Nora',
        lastName: 'Martin',
        email: 'nora@example.com',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/profiles')
      .send({
        address: '3 rue Victor Hugo',
        phone: '+33611111111',
        membershipNumber: 'MEM-TEST-001',
        joinedAt: '2026-04-15T10:00:00.000Z',
        userId: user.body.id,
      })
      .expect(201);

    const book = await request(app.getHttpServer())
      .post('/books')
      .send({
        title: 'L\'Étranger',
        isbn: '978-2070360022',
        publishedYear: 1942,
        totalCopies: 3,
        availableCopies: 3,
        summary: 'Roman majeur du XXe siècle',
        categoryId: category.body.id,
        authorIds: [author.body.id],
      })
      .expect(201);

    const loan = await request(app.getHttpServer())
      .post('/loans')
      .send({
        dueDate: '2026-05-01T10:00:00.000Z',
        userId: user.body.id,
        bookId: book.body.id,
      })
      .expect(201);

    expect(loan.body.status).toBe('BORROWED');

    const updatedLoan = await request(app.getHttpServer())
      .patch(`/loans/${loan.body.id}`)
      .send({ status: 'RETURNED' })
      .expect(200);

    expect(updatedLoan.body.status).toBe('RETURNED');

    const updatedBook = await request(app.getHttpServer())
      .get(`/books/${book.body.id}`)
      .expect(200);

    expect(updatedBook.body.availableCopies).toBe(3);
  });
});
