import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateVersaoTable1743022968000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
