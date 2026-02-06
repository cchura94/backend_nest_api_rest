import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductoAlmacenSucursalTable1770342927884 implements MigrationInterface {
    name = 'CreateProductoAlmacenSucursalTable1770342927884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sucursales" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "direccion" character varying(255) NOT NULL, "ciudad" character varying(100) NOT NULL, CONSTRAINT "PK_c2232960c9e458db5b18d35eeba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "almacenes" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "codigo" character varying(100), "descripcion" text, "sucursalId" integer, CONSTRAINT "PK_2af9818dc2019bc97c7d26217e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "almacen_producto" ("id" SERIAL NOT NULL, "cantidad_actual" integer NOT NULL, "fecha_actualizacion" date NOT NULL, "almacenId" integer, "productoId" integer, CONSTRAINT "PK_d012ea8045175d18843e998dea7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "almacenes" ADD CONSTRAINT "FK_f925acc11f5654a6be6ba3855fa" FOREIGN KEY ("sucursalId") REFERENCES "sucursales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "almacen_producto" ADD CONSTRAINT "FK_696fa0d027c3bfd994ab1b8ecaa" FOREIGN KEY ("almacenId") REFERENCES "almacenes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "almacen_producto" ADD CONSTRAINT "FK_87fdbb2b70a59565ceca5e2a428" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "almacen_producto" DROP CONSTRAINT "FK_87fdbb2b70a59565ceca5e2a428"`);
        await queryRunner.query(`ALTER TABLE "almacen_producto" DROP CONSTRAINT "FK_696fa0d027c3bfd994ab1b8ecaa"`);
        await queryRunner.query(`ALTER TABLE "almacenes" DROP CONSTRAINT "FK_f925acc11f5654a6be6ba3855fa"`);
        await queryRunner.query(`DROP TABLE "almacen_producto"`);
        await queryRunner.query(`DROP TABLE "almacenes"`);
        await queryRunner.query(`DROP TABLE "sucursales"`);
    }

}
