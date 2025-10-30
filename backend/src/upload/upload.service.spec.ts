import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UploadService', () => {
  let service: UploadService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: PrismaService,
          useValue: {
            file: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save file record', async () => {
    const mockFile = {
      filename: 'test.txt',
      originalname: 'original.txt',
      mimetype: 'text/plain',
      size: 1024,
      path: '/uploads/test.txt',
    } as Express.Multer.File;

    const mockFileRecord = { id: '1', ...mockFile, userId: 'user1' };
    jest.spyOn(prismaService.file, 'create').mockResolvedValue(mockFileRecord as any);

    const result = await service.saveFileRecord(mockFile, 'user1');
    expect(result).toEqual(mockFileRecord);
  });
});
