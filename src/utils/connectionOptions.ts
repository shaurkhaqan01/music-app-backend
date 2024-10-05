import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const databaseProvider: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  autoLoadEntities: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export { databaseProvider };
