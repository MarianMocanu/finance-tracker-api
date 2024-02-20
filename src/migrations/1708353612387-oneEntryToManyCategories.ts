import { MigrationInterface, QueryRunner } from "typeorm";

export class OneEntryToManyCategories1708353612387 implements MigrationInterface {
    name = 'OneEntryToManyCategories1708353612387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" DROP CONSTRAINT "FK_5e1c00d1bf0d7f449fbd257d3c8"`);
        await queryRunner.query(`ALTER TABLE "entry" DROP CONSTRAINT "UQ_5e1c00d1bf0d7f449fbd257d3c8"`);
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "entryId" integer`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_ad5054f42ac5232c9df90a21885" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_ad5054f42ac5232c9df90a21885"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "entryId"`);
        await queryRunner.query(`ALTER TABLE "entry" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "entry" ADD CONSTRAINT "UQ_5e1c00d1bf0d7f449fbd257d3c8" UNIQUE ("categoryId")`);
        await queryRunner.query(`ALTER TABLE "entry" ADD CONSTRAINT "FK_5e1c00d1bf0d7f449fbd257d3c8" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
