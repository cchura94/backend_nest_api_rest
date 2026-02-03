import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../modules/admin/users/entities/user.entity";
import { Role } from "../../modules/admin/roles/entities/role.entity";
import { Permission } from "../../modules/admin/permissions/entities/permission.entity";
import { SeedService } from "./seed.service";

@Module({
    imports: [TypeOrmModule.forFeature([User, Role, Permission])],
    providers: [SeedService]
})
export class SeedModule{

}