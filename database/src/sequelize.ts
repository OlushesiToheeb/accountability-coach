import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import { models } from './models';

/**
 * Build a Sequelize instance wired to all models. The backend imports this
 * (via @nestjs/sequelize or directly). Postgres only (docs/09 §1).
 */
export function createSequelize(databaseUrl = process.env.DATABASE_URL): Sequelize {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }
  return new Sequelize(databaseUrl, {
    dialect: 'postgres',
    models,
    logging: false,
  });
}
