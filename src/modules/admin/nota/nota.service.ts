import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ClienteProveedor } from '../cliente-proveedor/entities/cliente-proveedor.entity';
import { Nota } from './entities/nota.entity';
import { Movimiento } from './entities/movimiento.entity';
import { Producto } from '../inventario/producto/entities/producto.entity';
import { Almacen } from '../inventario/almacen/entities/almacen.entity';
import { QueryRunner } from 'typeorm/browser';
import { AlmacenProducto } from '../inventario/almacen/entities/almacen_producto.entity';

@Injectable()
export class NotaService {
  constructor(
    @InjectDataSource()
    private dataSource:DataSource
  ){}

  async create(createNotaDto: CreateNotaDto) {
    // transacciones
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect()
    await queryRunner.startTransaction();

    try {
      const userRepository = queryRunner.manager.getRepository(User)
      const clienteRepository = queryRunner.manager.getRepository(ClienteProveedor)
      const notaRepository = queryRunner.manager.getRepository(Nota)
      const productoRepository = queryRunner.manager.getRepository(Producto)
      const movimientoRepository = queryRunner.manager.getRepository(Movimiento)
      const almacenRepository = queryRunner.manager.getRepository(Almacen)
      // buscar usuario en la BD (capturar con la sesion actual automaticamente)
      const user = await userRepository.findOneBy({id: createNotaDto.user_id});
      if(!user) throw new NotFoundException('Usuario no econtrado');

      // buscar el cliente en la BD
      const cliente = await clienteRepository.findOneBy({id: createNotaDto.cliente_id});
      if(!cliente) throw new NotFoundException('Cliente no econtrado');

      // crear Nota
      const nota = await notaRepository.create({
        ...createNotaDto,
        cliente: cliente,
        user: user
      })

      // guardar la nota
      await notaRepository.save(nota)

      const movimientosGuardados: Movimiento[] = []

      for (const m of createNotaDto.movimientos) {
        const producto = await productoRepository.findOneBy({id: m.producto_id});
        if(!producto) throw new NotFoundException("Producto no encontrado");

        const almacen = await almacenRepository.findOneBy({id: m.almacen_id});
        if(!almacen) throw new NotFoundException("Almacen no encontrado");
        
        const movimiento = movimientoRepository.create({
          ...m,
          nota,
          producto,
          almacen
        });

        //actualizar stock de inventario

        await this.actualizarStockConQueryRunner(queryRunner, almacen, producto, m.cantidad, m.tipo_movimiento);

        const movGuardado = await movimientoRepository.save(movimiento)
        movimientosGuardados.push(movGuardado)

      }

      nota.movimientos = movimientosGuardados;

      await queryRunner.commitTransaction();

      return nota;

      
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error;
    }finally{
      await queryRunner.release()
    }
  }

  private async actualizarStockConQueryRunner(queryRunner: QueryRunner, almacen: Almacen, producto: Producto, cantidad:number, tipo: 'ingreso' | 'salida' | 'devolucion'){
    const almacenProductoRepo = queryRunner.manager.getRepository(AlmacenProducto);
    
    let ap = await almacenProductoRepo.findOne({
      where: {
        almacen: {id: almacen.id},
        producto: {id: producto.id}
      },
      relations: ['almacen', 'producto']
    });

    if(!ap){
      if(tipo === 'salida'){
        throw new BadRequestException('No hay stock registrado para este producto en este almacen');
      }

      ap = almacenProductoRepo.create({
        almacen, producto, cantidad_actual: cantidad, fecha_actualizacion: new Date()
      });
    }else{
      if(tipo ==='ingreso' || tipo === 'devolucion'){
        ap.cantidad_actual += cantidad
      }else if(tipo === 'salida'){
        if(ap.cantidad_actual < cantidad){
          throw new BadRequestException('Stock insuficiente para la salida');
        }
        ap.cantidad_actual -= cantidad
      }
      ap.fecha_actualizacion = new Date()
    }
    await almacenProductoRepo.save(ap);

  }

  findAll() {
    return `This action returns all nota`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nota`;
  }

  update(id: number, updateNotaDto: UpdateNotaDto) {
    return `This action updates a #${id} nota`;
  }

  remove(id: number) {
    return `This action removes a #${id} nota`;
  }
}
