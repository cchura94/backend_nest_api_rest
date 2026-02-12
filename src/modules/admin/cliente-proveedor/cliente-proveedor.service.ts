import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteProveedorDto } from './dto/create-cliente-proveedor.dto';
import { UpdateClienteProveedorDto } from './dto/update-cliente-proveedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteProveedor } from './entities/cliente-proveedor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteProveedorService {
  constructor(
    @InjectRepository(ClienteProveedor)
    private clienteRepository: Repository<ClienteProveedor>
  ){}

  create(createClienteProveedorDto: CreateClienteProveedorDto) {
    const cliente = this.clienteRepository.create(createClienteProveedorDto);
    return this.clienteRepository.save(cliente);
  }

  findAll() {
    return this.clienteRepository.find();
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOneBy({id})
    if(!cliente) throw new NotFoundException("cliente no existe");
    return cliente;
  }

  async update(id: number, updateClienteProveedorDto: UpdateClienteProveedorDto) {
    const cliente = await this.findOne(id)
    this.clienteRepository.merge(cliente, updateClienteProveedorDto);
    return this.clienteRepository.save(cliente);
  }

  remove(id: number) {
    return `This action removes a #${id} clienteProveedor`;
  }
}
