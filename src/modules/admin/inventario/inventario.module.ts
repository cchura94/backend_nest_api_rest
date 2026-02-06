import { Module } from '@nestjs/common';
import { CategoriaModule } from './categoria/categoria.module';
import { ProductoModule } from './producto/producto.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { AlmacenModule } from './almacen/almacen.module';

@Module({
  imports: [CategoriaModule, ProductoModule, SucursalModule, AlmacenModule]
})
export class InventarioModule {}
