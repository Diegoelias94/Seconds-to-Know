const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('PostgreSQL connected');
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message);
    console.error('Connection string:', process.env.DATABASE_URL);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };