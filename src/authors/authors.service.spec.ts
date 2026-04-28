import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AuthorsService } from './authors.service';
import { Author } from './models/author.model';
import { NotFoundException } from '@nestjs/common';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let model: typeof Author;

  const mockAuthor = {
    id: 1,
    firstName: 'Albert',
    lastName: 'Camus',
    bio: 'Bio test',
    update: jest.fn().mockResolvedValue({ id: 1, firstName: 'Albert Updated' }),
    destroy: jest.fn().mockResolvedValue(true),
  };

  const mockAuthorModel = {
    create: jest.fn().mockResolvedValue(mockAuthor),
    findAll: jest.fn().mockResolvedValue([mockAuthor]),
    findByPk: jest.fn().mockResolvedValue(mockAuthor),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getModelToken(Author),
          useValue: mockAuthorModel,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    model = module.get<typeof Author>(getModelToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockAuthor]);
      expect(model.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single author', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockAuthor);
    });

    it('should throw NotFoundException if author not found', async () => {
      jest.spyOn(model, 'findByPk').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create an author', async () => {
      const dto = { firstName: 'Albert', lastName: 'Camus', bio: 'Bio' };
      const result = await service.create(dto);
      expect(result).toEqual(mockAuthor);
    });
  });
});
