import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionFieldToCategory1787206548048 implements MigrationInterface {
  name = 'AddDescriptionFieldToCategory1787206548048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "description" character varying NOT NULL DEFAULT 'Curated Wig'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "description"`,
    );
  }
}
