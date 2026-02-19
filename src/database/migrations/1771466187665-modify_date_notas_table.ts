import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyDateNotasTable1771466187665 implements MigrationInterface {
    name = 'ModifyDateNotasTable1771466187665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notas" DROP CONSTRAINT "UQ_b96326a7b67dcea6caea376982b"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notas" ADD CONSTRAINT "UQ_b96326a7b67dcea6caea376982b" UNIQUE ("fecha")`);
    }

}
