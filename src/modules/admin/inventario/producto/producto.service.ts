import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { Categoria } from '../categoria/entities/categoria.entity';

@Injectable()
export class ProductoService {

  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ){}

  async create(createProductoDto: CreateProductoDto) {
    // verificar si la categria existe
    const categoria = await this.categoriaRepository.findOne({where: {id: createProductoDto.categoria}});
    if(!categoria) throw new NotFoundException('Categoria no encontrada');

    const producto = this.productoRepository.create({...createProductoDto, categoria})
    return this.productoRepository.save(producto);
  }

  // paginación
  async findAll(page: number=1, limit:number=10, search:string='', sortBy: string='id', order: 'ASC'|'DESC' = 'DESC', almacen:number=0, activo: boolean = true) {
    const queryBuilder = this.productoRepository.createQueryBuilder('producto')
                  .leftJoinAndSelect('producto.almacenes', 'productoAlmacen')
                  .leftJoinAndSelect('productoAlmacen.almacen', 'almacen')
                  .where('producto.estado = :activo', {activo});

                  // busqueda
                  if(search){
                    queryBuilder.andWhere('(producto.nombre ILIKE :search OR producto.marca ILIKE :search', {search: `%${search}%`})
                  }

                  if(almacen && almacen > 0){
                    queryBuilder.andWhere('almacen.id = :almacen', {almacen});
                  }

                  // ordenación
                  queryBuilder.orderBy(`producto.${sortBy}`, order);

                  // paginación
                  queryBuilder.skip((page - 1)*limit).take(limit)

                  const [productos, total] = await queryBuilder.getManyAndCount()
                  const totalPages = Math.ceil(total/limit);

                  return {
                    data: productos,
                    total,
                    limit,
                    page,
                    totalPages,
                    activo, 
                    almacen,
                    order,
                    search, 
                    sortBy
                  }

  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({where: {id}});
    if(!producto) throw new NotFoundException('Categoria no encontrada');
    return producto;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
