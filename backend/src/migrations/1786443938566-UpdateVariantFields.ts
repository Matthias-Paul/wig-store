import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateVariantFields1786443938566 implements MigrationInterface {
  name = 'UpdateVariantFields1786443938566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "color" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "laceType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "closureSize" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "UQ_960df1345469589ad08ceb8f614" UNIQUE ("product_id", "length", "color", "closureSize")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "UQ_960df1345469589ad08ceb8f614"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "closureSize"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "laceType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "color"`,
    );
  }
}
