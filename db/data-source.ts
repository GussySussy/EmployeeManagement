import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import dotenv from 'dotenv'

dotenv.config()

export const datasource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  extra: { max: 5, min: 2 },
  // synchronize: true,
  synchronize: false, //migrations
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ["dist/entities/*.js"], // all the entities in that folder
  migrations: ["dist/db/migrations/*.js"],
});
