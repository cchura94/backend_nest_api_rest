import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SucursalService {

  constructor(
    @InjectRepository(Sucursal)
    private sucursalRepository: Repository<Sucursal>
  ){

  }

  async create(createSucursalDto: CreateSucursalDto) {
    const sucursal = this.sucursalRepository.create(createSucursalDto);
    return await this.sucursalRepository.save(sucursal);
  }

  async findAll() {
    return await this.sucursalRepository.find();
  }

  async findOne(id: number) {
    const sucursal = await this.sucursalRepository.findOne({
      where: {id}
    })

    if(!sucursal){
      throw new NotFoundException(`Sucursal con id ${id} no encontrada`);
    }

    return sucursal;
  }

  async update(id: number, updateSucursalDto: UpdateSucursalDto) {
    const sucursal = await this.findOne(id);
    Object.assign(sucursal, updateSucursalDto);
    return await this.sucursalRepository.save(sucursal);
  }

  async remove(id: number) {
    const sucursal = await this.findOne(id);
    await this.sucursalRepository.remove(sucursal);
  }
}
