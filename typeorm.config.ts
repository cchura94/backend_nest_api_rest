import { config } from "dotenv";
import { DataSource } from "typeorm";

config(); // carga las variables de entorno del archivo .env

export default new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + "/src/**/*.entity{.ts,.js}"],
    migrations: [__dirname + "/src/database/migrations/*{.ts,.js}"],
    synchronize: false
});