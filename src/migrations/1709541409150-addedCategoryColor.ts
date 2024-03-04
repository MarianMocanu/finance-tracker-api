import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCategoryColor1709541409150 implements MigrationInterface {
    name = 'AddedCategoryColor1709541409150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "color" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "color"`);
    }

}
