import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/admin/users/users.module';
import { RolesModule } from './modules/admin/roles/roles.module';
import { PermissionsModule } from './modules/admin/permissions/permissions.module';
import { SeedModule } from './database/seeders/seed.module';
import { AuthModule } from './modules/auth/auth.module';
import { InventarioModule } from './modules/admin/inventario/inventario.module';
import { ClienteProveedorModule } from './modules/admin/cliente-proveedor/cliente-proveedor.module';
import { NotaModule } from './modules/admin/nota/nota.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'locahost',
      port: +`${process.env.DATABASE_PORT}` || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgresql',
      database: process.env.DATABASE_NAME|| 'bd_back_nest_api',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false
    }),
    SeedModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    InventarioModule,
    ClienteProveedorModule,
    NotaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
