const Pool = require('pg').Pool;

const pool = new Pool({
  user: process.env.POSTGRES_USER|'postgres',
  host: process.env.POSTGRES_HOST|'localhost',
  database: 'api_development',
  password: process.env.POSTGRES_PASSWORD|'',
  port: 5432,
});
module.exports = {
  query: (text, params) => pool.query(text, params)
}