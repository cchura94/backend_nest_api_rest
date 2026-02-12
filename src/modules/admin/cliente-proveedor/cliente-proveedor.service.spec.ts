import { Test, TestingModule } from '@nestjs/testing';
import { ClienteProveedorService } from './cliente-proveedor.service';

describe('ClienteProveedorService', () => {
  let service: ClienteProveedorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClienteProveedorService],
    }).compile();

    service = module.get<ClienteProveedorService>(ClienteProveedorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
