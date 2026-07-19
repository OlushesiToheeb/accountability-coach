// sequelize-cli config. Reads DATABASE_URL from the environment (or a local .env).
try {
  require('dotenv').config();
} catch (_) {
  /* dotenv optional — export DATABASE_URL in your shell if not installed */
}

const common = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
};

module.exports = {
  development: common,
  test: common,
  production: common,
};
