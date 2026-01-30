import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from '@nestjs/typeorm';

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
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
