import { MigrationInterface, QueryRunner } from "typeorm";

export class OneEntryToManyCategories1708353859596 implements MigrationInterface {
    name = 'OneEntryToManyCategories1708353859596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_ad5054f42ac5232c9df90a21885"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "entryId"`);
        await queryRunner.query(`ALTER TABLE "entry" ADD "categoriesId" integer`);
        await queryRunner.query(`ALTER TABLE "entry" ADD CONSTRAINT "FK_ed4ea0adb11cf53b7d105ba5d3f" FOREIGN KEY ("categoriesId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" DROP CONSTRAINT "FK_ed4ea0adb11cf53b7d105ba5d3f"`);
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "categoriesId"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "entryId" integer`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_ad5054f42ac5232c9df90a21885" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
