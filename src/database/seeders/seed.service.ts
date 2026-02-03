import { OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../modules/admin/users/entities/user.entity";
import { Repository } from "typeorm";
import { Role } from "../../modules/admin/roles/entities/role.entity";
import { Permission } from "../../modules/admin/permissions/entities/permission.entity";
import * as bcrypt from 'bcrypt'

export class SeedService implements OnApplicationBootstrap{

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        @InjectRepository(Permission) private readonly permRepo: Repository<Permission>
    ){}

    async onApplicationBootstrap() {
        await this.run();
    }

    async run(){

        // 1. Crear Permisos Básicos

        const countPerms = await this.permRepo.count();
        if(countPerms > 0) return; // Si ya hay datos , no hace nada

        const pReadUsers = this.permRepo.create({action: 'read', subject: 'users', label: 'Listar Usuarios', visibleInMenu: true, route: "/admin/users"});
        const pWriteUsers = this.permRepo.create({action: 'create', subject: 'users', label: 'Crear Usuarios'});
        await this.permRepo.save([pReadUsers, pWriteUsers]);

        // 2. Crear Roles
        
        const adminRole = this.roleRepo.create({
            name: 'admin',
            descripcion: 'Administrador',
            permissions: [pReadUsers, pWriteUsers],
        });

        await this.roleRepo.save(adminRole);

        // 3. Crear Usuario admin 
        const adminUser = this.userRepo.create({
            username: 'admin',
            email: 'admin@mail.com',
            password: await bcrypt.hash('admin54321', 12),
            isActive: true,
            roles: [adminRole]
        });

        await this.userRepo.save(adminUser);

        console.log('Ejecutó Seeders con éxito... ');

    }

}