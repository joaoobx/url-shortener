import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class Url1645574354385 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'url',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'originalUrl',
            type: 'varchar',
          },
          {
            name: 'shortUrl',
            type: 'varchar',
          },
          {
            name: 'urlCode',
            type: 'varchar',
          },
          {
            name: 'views',
            type: 'integer',
          },
          {
            name: 'userId',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    const foreignKey = new TableForeignKey({
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'user',
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey('url', foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('url');
  }
}
