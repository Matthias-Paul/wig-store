import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTestField1786194687141 implements MigrationInterface {
  name = 'AddTestField1786194687141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "testMigrationField" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "testMigrationField"`,
    );
  }
}
