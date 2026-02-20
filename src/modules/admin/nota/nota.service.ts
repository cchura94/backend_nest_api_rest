import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ClienteProveedor } from '../cliente-proveedor/entities/cliente-proveedor.entity';
import { Nota } from './entities/nota.entity';
import { Movimiento } from './entities/movimiento.entity';
import { Producto } from '../inventario/producto/entities/producto.entity';
import { Almacen } from '../inventario/almacen/entities/almacen.entity';
import { QueryRunner } from 'typeorm/browser';
import { AlmacenProducto } from '../inventario/almacen/entities/almacen_producto.entity';
import { FiltroNotaDto } from './dto/filtro-nota.dto';


import { Response } from 'express';

import PDFDocument from 'pdfkit';

@Injectable()
export class NotaService {
  constructor(
    @InjectDataSource()
    private dataSource:DataSource,
    @InjectRepository(Nota)
    private notaRepo: Repository<Nota>
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

  async findAll(filtro: FiltroNotaDto) {

    const query = this.notaRepo.createQueryBuilder('nota')
                          .leftJoinAndSelect('nota.user', 'user')
                          .leftJoinAndSelect('nota.cliente', 'cliente')
                          .leftJoinAndSelect('nota.movimientos', 'movimientos')
                          .leftJoinAndSelect('movimientos.producto', 'producto');
    
    if(filtro.tipo_nota){
      query.andWhere('nota.tipo_nota = :tipo_nota', {tipo_nota: filtro.tipo_nota});
    }

    if(filtro.estado_nota){
      query.andWhere('nota.estado_nota = :estado_nota', {estado_nota: filtro.estado_nota});
    }

    if(filtro.desde){
      query.andWhere('nota.fecha = :desde', {desde: filtro.desde});
    }

    if(filtro.hasta){
      query.andWhere('nota.fecha = :hasta', {hasta: filtro.hasta});
    }

    if(filtro.user_id){
      query.andWhere('nota.userId = :user_id', {user_id: filtro.user_id});
    }

    if(filtro.cliente_id){
      query.andWhere('nota.clienteId = :cliente_id', {cliente_id: filtro.cliente_id});
    }

    query.orderBy('nota.fecha', 'DESC');

    // paginación
    const limit = filtro.limit || 10;
    const page = filtro.page || 1;

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {data, total};
  }


  async generarPdfNotaPdfkit(id: number, res: Response) {

    const nota = await this.notaRepo.findOne({
      where: { id },
      relations: [
        'cliente',
        'user',
        'movimientos',
        'movimientos.producto',
        'movimientos.almacen'
      ]
    });
  
    if (!nota) {
      throw new NotFoundException('Nota no encontrada');
    }
  
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
  
    // Headers HTTP
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=nota-${nota.id}.pdf`
    );
  
    doc.pipe(res);
  
    // ===== ENCABEZADO =====
    doc
      .fontSize(18)
      .text('REPORTE DE NOTA', { align: 'center' })
      .moveDown();
  
    doc.fontSize(12);
    doc.text(`ID: ${nota.id}`);
    doc.text(`Fecha: ${nota.fecha.toISOString().split('T')[0]}`);
    doc.text(`Cliente: ${nota.cliente?.razon_social ?? ''}`);
    doc.text(`Usuario: ${nota.user?.username ?? ''}`);
    doc.text(`Tipo: ${nota.tipo_nota}`);
    doc.text(`Estado: ${nota.estado_nota}`);
    doc.moveDown();
  
    // ===== TABLA =====
  
    const tableTop = doc.y;
    const itemSpacing = 20;
  
    // Encabezados tabla
    doc
      .fontSize(10)
      .text('Producto', 40, tableTop)
      .text('Almacén', 140, tableTop)
      .text('Cant.', 240, tableTop)
      .text('Tipo', 290, tableTop)
      .text('P. Unit.', 340, tableTop)
      .text('Total', 420, tableTop);
  
    let position = tableTop + itemSpacing;
    let totalGeneral = 0;
  
    nota.movimientos.forEach((mov) => {
  
      const total =
        Number(mov.cantidad) *
        Number(
          nota.tipo_nota === 'compra'
            ? mov.precio_unitario_compra
            : mov.precio_unitario_venta
        );
  
      totalGeneral += total;
  
      doc
        .fontSize(9)
        .text(mov.producto?.nombre ?? '', 40, position)
        .text(mov.almacen?.nombre ?? '', 140, position)
        .text(mov.cantidad.toString(), 240, position)
        .text(mov.tipo_movimiento, 290, position)
        .text(
          (
            nota.tipo_nota === 'compra'
              ? mov.precio_unitario_compra
              : mov.precio_unitario_venta
          ).toString(),
          340,
          position
        )
        .text(total.toFixed(2), 420, position);
  
      position += itemSpacing;
    });
  
    // ===== TOTAL GENERAL =====
    doc.moveDown(2);
  
    doc
      .fontSize(12)
      .text(`TOTAL GENERAL: ${totalGeneral.toFixed(2)}`, {
        align: 'right'
      });
  
    // ===== PIE =====
    doc.moveDown(3);
    doc
      .fontSize(8)
      .text('Documento generado automáticamente por el sistema', {
        align: 'center'
      });
  
    doc.end();
  }

  async generarPdfNotaPdfkitEstilizado(id: number, res: Response) {
    // Buscar la nota con todas sus relaciones
    const nota = await this.notaRepo.findOne({
      where: { id },
      relations: [
        'cliente',
        'user',
        'movimientos',
        'movimientos.producto',
        'movimientos.almacen',
      ],
    });
  
    if (!nota) throw new NotFoundException('Nota no encontrada');
  
    // Crear PDF
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
  
    // Headers HTTP
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=nota-${nota.id}.pdf`,
    );
  
    doc.pipe(res);
  
    // ===== ENCABEZADO =====
    doc
      .fontSize(20)
      .fillColor('#333')
      .text('REPORTE DE NOTA', { align: 'center', underline: true })
      .moveDown(1.5);
  
    doc.fontSize(12).fillColor('#000');
    doc.text(`ID: ${nota.id}`, { continued: true }).text(
      `     Fecha: ${nota.fecha.toISOString().split('T')[0]}`,
    );
    doc.text(`Cliente: ${nota.cliente?.razon_social ?? ''}`, { continued: true }).text(
      `     Usuario: ${nota.user?.username ?? ''}`,
    );
    doc.text(`Tipo: ${nota.tipo_nota}`, { continued: true }).text(
      `     Estado: ${nota.estado_nota}`,
    );
  
    doc.moveDown(1);
  
    // ===== TABLA =====
    const tableTop = doc.y + 10;
    const itemSpacing = 20;
    const startX = 40;
  
    const columnPositions = {
      producto: startX,
      almacen: startX + 100,
      cantidad: startX + 200,
      tipo: startX + 250,
      precioUnit: startX + 300,
      total: startX + 400,
    };
  
    // Encabezados con fondo gris
    doc
      .rect(startX - 2, tableTop - 5, 500, 20)
      .fill('#eeeeee')
      .stroke();
  
    doc
      .fillColor('#000')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Producto', columnPositions.producto, tableTop)
      .text('Almacén', columnPositions.almacen, tableTop)
      .text('Cant.', columnPositions.cantidad, tableTop, { width: 40, align: 'right' })
      .text('Tipo', columnPositions.tipo, tableTop)
      .text('P. Unit.', columnPositions.precioUnit, tableTop, { width: 50, align: 'right' })
      .text('Total', columnPositions.total, tableTop, { width: 50, align: 'right' });
  
    let position = tableTop + itemSpacing;
    let totalGeneral = 0;
  
    doc.font('Helvetica').fontSize(9);
  
    // Recorrer movimientos
    nota.movimientos.forEach((mov) => {
      // Conversión segura a números
      const cantidad = Number(mov.cantidad ?? 0);
      const precioUnit =
        nota.tipo_nota === 'compra'
          ? Number(mov.precio_unitario_compra ?? 0)
          : Number(mov.precio_unitario_venta ?? 0);
  
      const total = cantidad * precioUnit;
      totalGeneral += total;
  
      // Fondo alterno de fila
      if (nota.movimientos.indexOf(mov) % 2 === 0) {
        doc
          .rect(startX - 2, position - 3, 500, 18)
          .fill('#f9f9f9')
          .fillColor('#000'); // reset fill
      }
  
      doc
        .text(mov.producto?.nombre ?? '', columnPositions.producto, position)
        .text(mov.almacen?.nombre ?? '', columnPositions.almacen, position)
        .text(cantidad.toString(), columnPositions.cantidad, position, { width: 40, align: 'right' })
        .text(mov.tipo_movimiento, columnPositions.tipo, position)
        .text(precioUnit.toFixed(2), columnPositions.precioUnit, position, { width: 50, align: 'right' })
        .text(total.toFixed(2), columnPositions.total, position, { width: 50, align: 'right' });
  
      position += itemSpacing;
    });
  
    // Línea separadora antes del total
    doc
      .moveTo(startX - 2, position - 5)
      .lineTo(startX + 498, position - 5)
      .strokeColor('#000')
      .stroke();
  
    // ===== TOTAL GENERAL =====
    doc.moveDown(2);
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`TOTAL GENERAL: ${totalGeneral.toFixed(2)}`, { align: 'right' });
  
    // ===== PIE =====
    doc.moveDown(3);
    doc
      .fontSize(8)
      .font('Helvetica-Oblique')
      .fillColor('#555')
      .text('Documento generado automáticamente por el sistema', { align: 'center' });
  
    // Finalizar PDF
    doc.end();
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
