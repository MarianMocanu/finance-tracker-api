import { MigrationInterface, QueryRunner } from "typeorm";

export class OneEntryToManyCategories1708353939626 implements MigrationInterface {
    name = 'OneEntryToManyCategories1708353939626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" DROP CONSTRAINT "FK_ed4ea0adb11cf53b7d105ba5d3f"`);
        await queryRunner.query(`ALTER TABLE "entry" RENAME COLUMN "categoriesId" TO "categoryId"`);
        await queryRunner.query(`ALTER TABLE "entry" ADD CONSTRAINT "FK_5e1c00d1bf0d7f449fbd257d3c8" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" DROP CONSTRAINT "FK_5e1c00d1bf0d7f449fbd257d3c8"`);
        await queryRunner.query(`ALTER TABLE "entry" RENAME COLUMN "categoryId" TO "categoriesId"`);
        await queryRunner.query(`ALTER TABLE "entry" ADD CONSTRAINT "FK_ed4ea0adb11cf53b7d105ba5d3f" FOREIGN KEY ("categoriesId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
