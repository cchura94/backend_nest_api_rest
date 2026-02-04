import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ){

  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string):Promise<User> {
    const user = await this.userRepository.findOneBy({id});
    if(!user){
      throw new NotFoundException(`El User con ID ${id} no se encuentra en la BD`);
    }
    return user;
  }

  async findOneByEmail(email: string):Promise<User> {
    const user = await this.userRepository.findOneBy({email});
    if(!user){
      throw new NotFoundException(`El User con email ${email} no se encuentra en la BD`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
