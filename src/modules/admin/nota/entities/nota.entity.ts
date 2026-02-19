import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClienteProveedor } from "../../cliente-proveedor/entities/cliente-proveedor.entity";
import { User } from "../../users/entities/user.entity";
import { Movimiento } from "./movimiento.entity";

@Entity('notas')
export class Nota {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    fecha: Date;

    @Column()
    tipo_nota: string; // compra, venta

    @ManyToOne( ()=> ClienteProveedor, {eager: true})
    cliente: ClienteProveedor;

    @ManyToOne(() => User, {eager: true})
    user: User;

    @Column({length: 50})
    estado_nota: string;

    @Column({length: 50})
    observaciones: string;

    @OneToMany(() => Movimiento, mov => mov.nota)
    movimientos: Movimiento[]
}
