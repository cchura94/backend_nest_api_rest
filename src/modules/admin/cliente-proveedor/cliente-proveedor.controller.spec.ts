import { Test, TestingModule } from '@nestjs/testing';
import { ClienteProveedorController } from './cliente-proveedor.controller';
import { ClienteProveedorService } from './cliente-proveedor.service';

describe('ClienteProveedorController', () => {
  let controller: ClienteProveedorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteProveedorController],
      providers: [ClienteProveedorService],
    }).compile();

    controller = module.get<ClienteProveedorController>(ClienteProveedorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
