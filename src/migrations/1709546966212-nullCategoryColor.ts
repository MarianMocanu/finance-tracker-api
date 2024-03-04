import { MigrationInterface, QueryRunner } from "typeorm";

export class NullCategoryColor1709546966212 implements MigrationInterface {
    name = 'NullCategoryColor1709546966212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "color" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "color" SET NOT NULL`);
    }

}
