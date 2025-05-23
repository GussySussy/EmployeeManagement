import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedAddressPincodeToString1747833386604 implements MigrationInterface {
    name = 'ChangedAddressPincodeToString1747833386604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "pincode"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "pincode" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "pincode"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "pincode" integer NOT NULL`);
    }

}
