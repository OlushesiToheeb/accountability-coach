import { createSequelize } from './sequelize';

/**
 * Dev-only schema sync. Convenient while iterating; use real migrations
 * (sequelize-cli) for anything shared or production (docs/09 §1).
 *   npm run sync:dev
 */
(async () => {
  const sequelize = createSequelize();
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  // eslint-disable-next-line no-console
  console.log('Database synced.');
  await sequelize.close();
})().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
