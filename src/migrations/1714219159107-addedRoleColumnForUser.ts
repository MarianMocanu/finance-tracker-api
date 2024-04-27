import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRoleColumnForUser1714219159107 implements MigrationInterface {
    name = 'AddedRoleColumnForUser1714219159107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin', 'premium')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "entry" ADD "date" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "entry" ADD "date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
