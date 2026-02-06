import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Almacen } from "../../almacen/entities/almacen.entity";
import { SucursalUser } from "./sucursal_user.entity";

@Entity('sucursales')
export class Sucursal {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    nombre:string;

    @Column({length: 255})
    direccion:string;

    @Column({length: 100})
    ciudad:string;

    @OneToMany(() => Almacen, almacen => almacen.sucursal)
    almacenes: Almacen[];

    @OneToMany(() => SucursalUser, su => su.sucursal)
    usuarios: SucursalUser;

}
