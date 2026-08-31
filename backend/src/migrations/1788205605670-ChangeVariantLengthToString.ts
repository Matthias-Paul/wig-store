import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeVariantLengthToString1788205605670
  implements MigrationInterface
{
  name = 'ChangeVariantLengthToString1788205605670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "length" TYPE character varying(50) USING "length"::text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "length" TYPE integer USING NULLIF(regexp_replace("length", '[^0-9]', '', 'g'), '')::integer`,
    );
  }
}
