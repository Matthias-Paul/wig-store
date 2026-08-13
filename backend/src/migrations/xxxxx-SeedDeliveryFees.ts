import { MigrationInterface, QueryRunner } from 'typeorm';

const STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'Federal Capital Territory',
];

export class SeedDeliveryFees1234567890123 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    for (const state of STATES) {
      const fee =
        state === 'Lagos'
          ? 1500
          : state === 'Federal Capital Territory'
            ? 2500
            : 3500;
      await queryRunner.query(
        `INSERT INTO "delivery_fees" ("state", "fee", "isActive") VALUES ($1, $2, true)`,
        [state, fee],
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "delivery_fees"`);
  }
}
