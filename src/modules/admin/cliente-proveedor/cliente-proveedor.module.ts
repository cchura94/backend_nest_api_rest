import { Module } from '@nestjs/common';
import { ClienteProveedorService } from './cliente-proveedor.service';
import { ClienteProveedorController } from './cliente-proveedor.controller';

@Module({
  controllers: [ClienteProveedorController],
  providers: [ClienteProveedorService],
})
export class ClienteProveedorModule {}
