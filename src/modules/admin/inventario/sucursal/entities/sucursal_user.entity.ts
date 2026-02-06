import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sucursal } from "./sucursal.entity";
import { Role } from "../../../../admin/roles/entities/role.entity";
import { User } from "../../../../admin/users/entities/user.entity";

@Entity('sucursal_user')
export class SucursalUser{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, {eager: true})
    user: string;

    @ManyToOne(() => Sucursal, sucursal => sucursal.usuarios, {eager: true})
    sucursal: Sucursal;

    @ManyToOne(()=> Role, {nullable: true, eager: true})
    role: Role;
    
}