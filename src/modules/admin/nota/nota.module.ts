import { Module } from '@nestjs/common';
import { NotaService } from './nota.service';
import { NotaController } from './nota.controller';
import { User } from '../users/entities/user.entity';
import { ClienteProveedor } from '../cliente-proveedor/entities/cliente-proveedor.entity';
import { Nota } from './entities/nota.entity';
import { Producto } from '../inventario/producto/entities/producto.entity';
import { Movimiento } from './entities/movimiento.entity';
import { Almacen } from '../inventario/almacen/entities/almacen.entity';
import { AlmacenProducto } from '../inventario/almacen/entities/almacen_producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([User, ClienteProveedor, Nota, Producto, Movimiento, Almacen, AlmacenProducto]) ],
  controllers: [NotaController],
  providers: [NotaService],
})
export class NotaModule {}
