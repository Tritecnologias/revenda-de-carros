import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateVeiculosEntities1708978800000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
