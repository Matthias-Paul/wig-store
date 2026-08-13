import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeliveryFees1786650248441 implements MigrationInterface {
  name = 'AddDeliveryFees1786650248441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "delivery_fees" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "state" character varying NOT NULL,
        "fee" numeric(10,2) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_10ec7956922985c74dfb87fe458"
          UNIQUE ("state"),
        CONSTRAINT "PK_736fa0ed72064a12309a2e731ac"
          PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD "deliveryFee" numeric(10,2) NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "orders"
      DROP COLUMN "deliveryFee"
    `);

    await queryRunner.query(`
      DROP TABLE "delivery_fees"
    `);
  }
}
