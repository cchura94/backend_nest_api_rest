import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlmacenDto } from './dto/create-almacen.dto';
import { UpdateAlmacenDto } from './dto/update-almacen.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Almacen } from './entities/almacen.entity';
import { Repository } from 'typeorm';
import { Sucursal } from '../sucursal/entities/sucursal.entity';

@Injectable()
export class AlmacenService {

  constructor(
    @InjectRepository(Almacen)
    private almacenRepository: Repository<Almacen>,
    
    @InjectRepository(Sucursal)
    private sucursalRepository: Repository<Sucursal>
    
    
  ){}
  async create(createAlmacenDto: CreateAlmacenDto) {
    const sucursal = await this.sucursalRepository.findOne({where: {id: createAlmacenDto.sucursal}})
    if(!sucursal) throw new NotFoundException('Sucursal no encontrada');

    const alm = this.almacenRepository.create({...createAlmacenDto, sucursal});
    return this.almacenRepository.save(alm);

  }


  findAll(sucursalId?:number) {
    if(sucursalId){
      return this.almacenRepository.find({
        where: {
          sucursal: {
            id: sucursalId
          }
        },
        relations: ['sucursal']
      });
    }else{
      return this.almacenRepository.find({
        relations: ['sucursal']
      })
    }
  }

  async findOne(id: number) {
    const almacen = await this.almacenRepository.findOneBy({id})
    if(!almacen) throw new NotFoundException('Elmalmacen no existe');
    return almacen;
  }

  async update(id: number, updateAlmacenDto: UpdateAlmacenDto) {
    const almacen = await this.findOne(id)
    if(updateAlmacenDto.sucursal) {
      const sucursal = await this.sucursalRepository.findOne({
        where: { id: updateAlmacenDto.sucursal}
      });

      if(!sucursal) throw new NotFoundException('Sucursal no encontrada');

      almacen.sucursal = sucursal;
    }
    Object.assign(almacen, updateAlmacenDto)

    return this.almacenRepository.save(almacen);
  }

  remove(id: number) {
    return `This action removes a #${id} almacen`;
  }
}
